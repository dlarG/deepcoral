from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import time

app = Flask(__name__)
CORS(app)

#For testing purposes, a simple route to check if the server is running.
@app.route('/')
def hello_world():
    return "Hello, World!"


# Route for register with a POST method
@app.route('/register', methods=["POST"])
# Method to create a new user 
def register_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    username = data.get('username')
    password = data.get('password')
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    roletype = 'guest'  # Default role type
    if not all([username, password, firstname, lastname]):
        return jsonify({"error": "Missing all fields are required"}), 400
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cur = conn.cursor()
        password_hashed = generate_password_hash(password)
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        if cur.fetchone():
            return jsonify({"error": "Username already exists"}), 400
        
        cur.execute(
            "INSERT INTO users (username, password, firstname, lastname, roletype) VALUES (%s, %s, %s, %s, %s)",
            (username, password_hashed, firstname, lastname, roletype)
        )
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


def rate_limit(max_per_minute):
    def decorator(f):
        calls = []
        
        @wraps(f)
        def wrapper(*args, **kwargs):
            now = time.time()
            calls.append(now)
            
            # Remove calls older than 1 minute
            while calls and calls[0] < now - 60:
                calls.pop(0)
                
            if len(calls) > max_per_minute:
                return jsonify({'error': 'Too many requests'}), 429
            return f(*args, **kwargs)
        return wrapper
    return decorator


@app.route('/login', methods=["POST"])
@rate_limit(5) # Limit to 5 requests per minute
def login_user():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    username = data.get('username')
    password = data.get('password')
    
    if not all([username, password]):
        return jsonify({'error': 'Username and password are required'}), 400
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:  # Using context manager
            cur.execute("SELECT * FROM users WHERE username = %s", (username,))
            user = cur.fetchone()
            
            if not user or not check_password_hash(user[2], password):
                return jsonify({'error': 'Invalid credentials'}), 401
                
            # Don't return sensitive data
            user_data = {
                'username': user[1],
                'firstname': user[3],
                'lastname': user[5],
                'roletype': user[7]
            }
            
            return jsonify({
                'message': 'Login successful',
                'user': user_data
            }), 200
            
    except Exception as e:
        # Log the actual error for debugging
        app.logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500
        
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)