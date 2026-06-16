import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      calculateTotal(items);
    }
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.newprice * item.quantity, 0);
    setTotalPrice(total);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>🛒 Your Cart is Empty</h2>
          <p>Start shopping to add items to your cart!</p>
          <Link to="/Product">
            <button className="continue-shopping">Continue Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Shopping Cart</h1>
        <p>{cartItems.length} items in cart</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="item-details">
                <div className="item-name">{item.name}</div>
                <div className="item-specs">{item.category}</div>
                <div className="item-price">₹{item.newprice.toLocaleString()}</div>

                <div className="item-quantity">
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                    <input type="number" value={item.quantity} readOnly />
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="item-total">
                ₹{(item.newprice * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-title">Order Summary</div>

          <div className="summary-row">
            <span className="summary-label">Subtotal:</span>
            <span className="summary-value">₹{totalPrice.toLocaleString()}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Shipping:</span>
            <span className="summary-value">₹50</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Tax (18%):</span>
            <span className="summary-value">₹{(totalPrice * 0.18).toLocaleString()}</span>
          </div>

          <div className="summary-row total">
            <span className="summary-label">Total:</span>
            <span className="summary-value">
              ₹{(totalPrice + 50 + totalPrice * 0.18).toLocaleString()}
            </span>
          </div>

          <Link to="/Shipping">
            <button className="checkout-btn">Proceed to Shipping</button>
          </Link>

          <Link to="/Product">
            <button className="continue-shopping">Continue Shopping</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;