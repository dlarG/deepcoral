import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Configure axios to send credentials with requests
axios.defaults.withCredentials = true;

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
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

    try {
      const res = await axios.post("http://localhost:5000/login", form, {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      setMessage(res.data.message);
      setForm((prev) => ({ ...prev, password: "" })); // Clear password

      // Store user data in localStorage/sessionStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect based on role
      switch (res.data.user.roletype.toLowerCase()) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "biologist":
          navigate("/biologist-dashboard");
          break;
        case "guest":
          navigate("/guest-dashboard");
          break;
        default:
          navigate("/"); // Fallback route
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || "Login failed";
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      {message && (
        <p style={message.includes("success") ? styles.success : styles.error}>
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
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          minLength="8"
        />
        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

// Alisdi rani poy
const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
  },
  success: {
    color: "green",
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

export default Login;
