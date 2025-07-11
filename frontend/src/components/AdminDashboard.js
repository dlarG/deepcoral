import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/users", {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": localStorage.getItem("csrf_token"),
          },
        });
        setUsers(response.data.users);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch users");
        if (err.response?.status === 401) {
          // Unauthorized - redirect to login
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": localStorage.getItem("csrf_token"),
          },
        }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("csrf_token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("csrf_token");
      navigate("/login");
    }
  };

  if (loading) return <div style={styles.loading}>Loading users...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <h2>User Management</h2>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>First Name</th>
              <th style={styles.th}>Last Name</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.firstname}</td>
                <td style={styles.td}>{user.lastname}</td>
                <td style={styles.td}>{user.roletype}</td>
                <td style={styles.td}>
                  <button
                    style={styles.actionButton}
                    onClick={() => handleEdit(user.id)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Example action handlers (implement these)
const handleEdit = (userId) => {
  console.log("Edit user:", userId);
  // You would typically navigate to an edit form:
  // navigate(`/edit-user/${userId}`);
};

const handleDelete = async (userId) => {
  if (window.confirm("Are you sure you want to delete this user?")) {
    try {
      await axios.delete(`http://localhost:5000/admin/users/${userId}`, {
        withCredentials: true,
        headers: {
          "X-CSRF-Token": localStorage.getItem("csrf_token"),
        },
      });
      // Refresh users after deletion
      window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  logoutButton: {
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#d32f2f",
    },
  },
  loading: {
    padding: "20px",
    textAlign: "center",
  },
  error: {
    padding: "20px",
    color: "red",
    textAlign: "center",
  },
  tableContainer: {
    overflowX: "auto",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
  },
  th: {
    backgroundColor: "#f5f5f5",
    padding: "12px 15px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  tr: {
    borderBottom: "1px solid #eee",
    ":hover": {
      backgroundColor: "#f9f9f9",
    },
  },
  td: {
    padding: "12px 15px",
    verticalAlign: "middle",
  },
  actionButton: {
    padding: "6px 12px",
    marginRight: "5px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#0b7dda",
    },
  },
  deleteButton: {
    backgroundColor: "#f44336",
    ":hover": {
      backgroundColor: "#d32f2f",
    },
  },
};

export default AdminDashboard;
