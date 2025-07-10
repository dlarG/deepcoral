from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db_connection
from werkzeug.security import generate_password_hash

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


if __name__ == '__main__':
    app.run(debug=True)