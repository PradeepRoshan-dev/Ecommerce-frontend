import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const API_BASE_URL =
  "https://ecommerce-backend-p1dv.onrender.com";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [adminName, setAdminName] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Verify the response has admin data with correct role
        if (data.admin && (data.admin.role === "admin" || data.admin.role === "superadmin")) {
          localStorage.setItem("adminToken", data.token);
          localStorage.setItem("adminId", data.admin.id);
          localStorage.setItem("adminName", data.admin.name);
          localStorage.setItem("adminRole", data.admin.role);
          
          setAdminName(data.admin.name);
          setShowWelcomePopup(true);
          
          // Auto-redirect after 5 seconds
          setTimeout(() => {
            navigate("/Admin/Dashboard");
          }, 5000);
        } else {
          setError("Invalid admin credentials");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div className="welcome-popup" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '15px',
          textAlign: 'center',
          zIndex: 9999,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <h2 style={{ color: '#ff6b6b', marginBottom: '20px', fontSize: '28px' }}>
            🎉 Welcome {adminName}!
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
            Admin login successful!
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Redirecting to admin dashboard...
          </p>
        </div>
      )}

      <div className="admin-login-card">
        <div className="login-header">
          <h1>🎮 GameHaven Admin</h1>
          <p>Admin Dashboard Login</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gamehaven.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="admin-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: admin@gamehaven.com</p>
          <p>Password: admin123</p>
        </div>

        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  );
}

export default AdminLogin;
