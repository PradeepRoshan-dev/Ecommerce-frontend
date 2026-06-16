import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [userName, setUserName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://ecommerce-backend-six-gules.vercel.app/api/admin/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);
        
        setUserName(data.user.name);
        setShowWelcomePopup(true);
        
        // Auto-redirect after 5 seconds
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Registerscreen">
      <div id="popupbg-reg"></div>

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
            Registration successful!
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Redirecting to home page...
          </p>
        </div>
      )}

      <div id="popup-reg">
        {/* LEFT SIDE */}

        <div className="left-side-reg">
          <h1 className="logo-Register">GameHaven</h1>

          <div className="left-content-reg">
            <h2>Welcome!</h2>

            <p>
              Register to continue shopping
              <br />
              the best gaming products.
            </p>

            <img
              src="loginimg.webp"
              alt="product"
              className="product-image-reg"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="right-side-reg">
          <div className="form-container-reg">
            <h2 className="heading-reg">Register</h2>

            <p className="para-reg">Enter your details to Register</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleRegister}>
              <div className="input-group-reg">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group-reg">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group-reg">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="Register-btn" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <div className="divider-reg">
              <span>or continue with</span>
            </div>

            <div className="social-Register">
              <button>Google</button>
              <button>Apple</button>
            </div>

            <p className="register-link">
              Already have an account?
              <Link to="/Login"> <button> Login</button> </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;