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
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Welcome Back</h2>

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
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength="8"
          />

          <button
            type="submit"
            disabled={isLoading}
            style={isLoading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.redirectText}>
            Don’t have an account? <a href="/register" style={styles.link}>Register here</a>
          </p>
        </form>
      </div>
    </div>
  );

}

// na alisdan na rald
const styles = {
  pageWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f4f8",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "400px",
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
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
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


export default Login;
