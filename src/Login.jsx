import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [userName, setUserName] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await fetch(
      "https://ecommerce-backend-six-gules.vercel.app/api/admin/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userId", data.admin.id);
      localStorage.setItem("userName", data.admin.name);
      localStorage.setItem("userRole", data.admin.role);

      setUserName(data.admin.name);
      setShowWelcomePopup(true);

      setTimeout(() => {
        if (
          data.admin.role === "admin" ||
          data.admin.role === "superadmin"
        ) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 2000);
    } else {
      setError(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    setError("Connection error. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="loginscreen">
      <div id="popupbg"></div>

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
            🎉 Welcome {userName}!
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
            Login successful!
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Redirecting to home page...
          </p>
        </div>
      )}

      <div id="popup">
        {/* LEFT SIDE */}

        <div className="left-side">
          <h1 className="logo-login">GameHaven</h1>

          <div className="left-content">
            <h2>Welcome Back!</h2>

            <p>
              Login to continue shopping
              <br />
              the best gaming products.
            </p>

            <img
              src="loginimg.jpg"
              alt="product"
              className="product-image"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="right-side">
          <div className="form-container">
            <h2 className="heading">Login</h2>

            <p className="para">Enter your details to login</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="options">
                <label>
                  <input type="checkbox" />
                  Remember Me
                </label>

                <a href="/">Forgot Password?</a>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button>Google</button>
              <button>Apple</button>
            </div>

            <p className="register-link">
              Don't have an account?
             <Link to="/Register"> <button> Register</button> </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;