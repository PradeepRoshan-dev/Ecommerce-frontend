import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./config/api.js";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/products`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching products:", err);
        setLoading(false);

        console.log("Mongo URI:", process.env.MONGO_URI);
      });
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category))];
  
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const getDiscountPercent = (oldprice, newprice) => {
    if (!oldprice || !newprice) return 0;
    return Math.round(((oldprice - newprice) / oldprice) * 100);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div style={{ 
        padding: "150px 30px 30px", 
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1540 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#00ffff",
        fontSize: "24px",
        fontWeight: "bold",
        textShadow: "0 0 20px rgba(0, 255, 255, 0.5)"
      }}>
        ⚡ Loading Gaming Products...
      </div>
    );
  }

  return (
    <div style={{ background: "linear-gradient(135deg, #0a0e27 0%, #1a1540 100%)", minHeight: "100vh" }}>
      {/* Category Filter */}
      <div style={{
        padding: "100px 30px 20px",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: "center",
        borderBottom: "2px solid rgba(0, 255, 255, 0.3)"
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "10px 20px",
              border: selectedCategory === cat ? "2px solid #00ffff" : "2px solid #ff006e",
              background: selectedCategory === cat 
                ? "linear-gradient(135deg, #00ffff, #00ff88)" 
                : "transparent",
              color: selectedCategory === cat ? "#0a0e27" : "#ff006e",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s ease",
              textTransform: "uppercase",
              fontSize: "12px",
              letterSpacing: "1px",
              boxShadow: selectedCategory === cat ? "0 0 15px rgba(0, 255, 255, 0.5)" : "none"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-container">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-tiles">
            {getDiscountPercent(product.oldprice, product.newprice) > 0 && (
              <div className="discount-badge" style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: "10"
              }}>
                -{getDiscountPercent(product.oldprice, product.newprice)}%
              </div>
            )}

            <div className="image-wrapper1">
              <img
                src={product.image}
                alt={product.name}
              />
            </div>

            <div className="product-info">
              <div className="category-badge">
                {product.category}
              </div>

              <h1>{product.name}</h1>

              {product.brand && (
                <p style={{ color: "#888", fontSize: "12px", marginBottom: "8px" }}>
                  {product.brand}
                </p>
              )}

              {/* Gaming Specs */}
              {(product.fpsRating || product.refreshRate || product.responseTime) && (
                <div className="gaming-specs">
                  {product.fpsRating && <span>🎯 {product.fpsRating} FPS</span>}
                  {product.refreshRate && <span>⚡ {product.refreshRate}Hz</span>}
                  {product.responseTime && <span>⏱️ {product.responseTime}ms</span>}
                </div>
              )}

              {/* Regular Specs */}
              <div className="specs">
                {product.color && <span>{product.color}</span>}
                {product.ram && <span>RAM: {product.ram}GB </span>}
                {product.storage && <span>Storage: {product.storage}GB </span>}
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="features">
                  {product.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="feature-tag">
                      ✨ {feature}
                    </span>
                  ))}
                </div>
              )}

              {/* Ratings */}
              <div className="ratings">
                ⭐ {product.rating} ({product.review} Reviews)
              </div>

              {/* Pricing */}
              <div className="price-section">
                {product.oldprice && (
                  <span className="old-price">
                    ₹{product.oldprice.toLocaleString()}
                  </span>
                )}
                <span className="new-price">
                  ₹{product.newprice.toLocaleString()}
                </span>
              </div>

              <button className="cartbtn" onClick={() => addToCart(product)}>
                🛒 Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
