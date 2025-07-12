// src/components/Register.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//ikaw salaman sa credentials rald HAHA wako kaybaw unsaon
// Configure axios to send credentials with requests
axios.defaults.withCredentials = true;

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  // Fetch CSRF token when component mounts
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("http://localhost:5000/csrf-token");
        setCsrfToken(response.data.csrf_token);
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
        setMessage(
          "Failed to initialize security token. Please refresh the page."
        );
      }
    };
    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Client-side validation
    if (form.password.length < 8) {
      setMessage("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", form, {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      setMessage(res.data.message);
      // Clear form on successful registration
      setForm({
        username: "",
        password: "",
        firstname: "",
        lastname: "",
      });

      // Optionally redirect to login after successful registration
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed";
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Create Your Account</h2>

        {message && (
          <p style={message.toLowerCase().includes("success") ? styles.success : styles.error}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="hidden" name="csrf_token" value={csrfToken} />

          <input
            style={styles.input}
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password (min 8 characters)"
            value={form.password}
            onChange={handleChange}
            required
            minLength="8"
          />
          <input
            style={styles.input}
            type="text"
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            style={isLoading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <p style={styles.redirectText}>
            Already have an account? <a href="/login" style={styles.link}>Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f6f8",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#2c3e50",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    padding: "12px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  buttonDisabled: {
    backgroundColor: "#95a5a6",
    cursor: "not-allowed",
  },
  success: {
    color: "#27ae60",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  error: {
    color: "#e74c3c",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  redirectText: {
    marginTop: "10px",
    textAlign: "center",
    fontSize: "14px",
    color: "#7f8c8d",
  },
  link: {
    color: "#3498db",
    textDecoration: "none",
  },
};


export default Register;
