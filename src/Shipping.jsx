import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Shipping.css";

function Shipping() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    shippingMethod: "standard"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage and proceed to payment
    localStorage.setItem("shippingData", JSON.stringify(formData));
    navigate("/Payment");
  };

  return (
    <div className="shipping-container">
      <div className="shipping-header">
        <h1>📦 Shipping Address</h1>
        <p>Step 2 of 3</p>
      </div>

      <div className="shipping-content">
        <form className="shipping-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Street Address *</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="123 Main Street"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>
            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ZIP Code *</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="123456"
                required
              />
            </div>
            <div className="form-group">
              <label>Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="India"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              required
            />
          </div>

          <div className="shipping-methods">
            <h3>Shipping Method</h3>
            <div className="method-option">
              <input
                type="radio"
                id="standard"
                name="shippingMethod"
                value="standard"
                checked={formData.shippingMethod === "standard"}
                onChange={handleChange}
              />
              <label htmlFor="standard">
                <span className="method-name">Standard Shipping</span>
                <span className="method-price">₹50 - 5-7 days</span>
              </label>
            </div>

            <div className="method-option">
              <input
                type="radio"
                id="express"
                name="shippingMethod"
                value="express"
                checked={formData.shippingMethod === "express"}
                onChange={handleChange}
              />
              <label htmlFor="express">
                <span className="method-name">Express Shipping</span>
                <span className="method-price">₹100 - 2-3 days</span>
              </label>
            </div>

            <div className="method-option">
              <input
                type="radio"
                id="overnight"
                name="shippingMethod"
                value="overnight"
                checked={formData.shippingMethod === "overnight"}
                onChange={handleChange}
              />
              <label htmlFor="overnight">
                <span className="method-name">Overnight Shipping</span>
                <span className="method-price">₹200 - Next day</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/Cart">
              <button type="button" className="back-btn">← Back to Cart</button>
            </Link>
            <button type="submit" className="continue-btn">Continue to Payment →</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Shipping;
