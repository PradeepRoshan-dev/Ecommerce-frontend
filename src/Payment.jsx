import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingData, setShippingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedShipping = localStorage.getItem("shippingData");
    
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedShipping) setShippingData(JSON.parse(savedShipping));

    // Calculate total
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const subtotal = cart.reduce((sum, item) => sum + item.newprice * item.quantity, 0);
      const shippingCost = 50;
      const tax = subtotal * 0.18;
      setTotalAmount(subtotal + shippingCost + tax);
    }
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setOrderPlaced(true);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="payment-container">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your purchase</p>
          <p className="order-number">Order #GH{Date.now()}</p>
          <p className="delivery-info">
            Your order will be delivered to {shippingData?.fullName} in {shippingData?.city}
          </p>
          <div className="success-actions">
            <Link to="/">
              <button className="home-btn">Return to Home</button>
            </Link>
            <button className="track-btn" onClick={() => {
              localStorage.removeItem("cart");
              localStorage.removeItem("shippingData");
            }}>
              View Order History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>💳 Payment</h1>
        <p>Step 3 of 3 - Complete your purchase</p>
      </div>

      <div className="payment-content">
        <div className="payment-form-section">
          <form className="payment-form" onSubmit={handlePayment}>
            <h3>Select Payment Method</h3>

            <div className="payment-methods">
              <div className={`method ${paymentMethod === "card" ? "active" : ""}`}>
                <input
                  type="radio"
                  id="card"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="card">
                  <span className="method-icon">💳</span>
                  <span>Credit/Debit Card</span>
                </label>
              </div>

              <div className={`method ${paymentMethod === "upi" ? "active" : ""}`}>
                <input
                  type="radio"
                  id="upi"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="upi">
                  <span className="method-icon">📱</span>
                  <span>UPI</span>
                </label>
              </div>

              <div className={`method ${paymentMethod === "netbanking" ? "active" : ""}`}>
                <input
                  type="radio"
                  id="netbanking"
                  value="netbanking"
                  checked={paymentMethod === "netbanking"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="netbanking">
                  <span className="method-icon">🏦</span>
                  <span>Net Banking</span>
                </label>
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="card-details">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" maxLength="5" required />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="123" maxLength="3" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input type="text" placeholder="Your Name" required />
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="upi-details">
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="email"
                    placeholder="yourname@upi"
                    required
                  />
                </div>
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="netbanking-details">
                <div className="form-group">
                  <label>Select Bank</label>
                  <select required>
                    <option>Select your bank</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>SBI</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="pay-btn"
              disabled={processing}
            >
              {processing ? "Processing..." : `Pay ₹${totalAmount.toLocaleString()}`}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item._id} className="summary-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">x{item.quantity}</span>
                </div>
                <span className="item-price">₹{(item.newprice * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-breakdown">
            <div className="breakdown-row">
              <span>Subtotal</span>
              <span>₹{(totalAmount * 0.85).toLocaleString()}</span>
            </div>
            <div className="breakdown-row">
              <span>Shipping</span>
              <span>₹50</span>
            </div>
            <div className="breakdown-row">
              <span>Tax (18%)</span>
              <span>₹{((totalAmount * 0.85) * 0.18).toLocaleString()}</span>
            </div>
          </div>

          <div className="summary-total">
            <span>Total Amount</span>
            <span>₹{totalAmount.toLocaleString()}</span>
          </div>

          <div className="shipping-info">
            <h4>Shipping To:</h4>
            <p>{shippingData?.fullName}</p>
            <p>{shippingData?.street}, {shippingData?.city}, {shippingData?.state}</p>
            <p>{shippingData?.zipCode}, {shippingData?.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
