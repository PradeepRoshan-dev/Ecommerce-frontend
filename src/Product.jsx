import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "https://ecommerce-backend-p1dv.onrender.com";
import "./Product.css";

function Product({
  selectedBrand = [],
  setSelectedBrand = () => {},

  selectedColor = [],
  setSelectedColor = () => {},
}) {
  const [products, setProducts] = useState([]);
  const [maxSelected, setMaxSelected] = useState(100000);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const categories = [
    ...new Set(products.map((p) => p.category)),
  ].sort();

  const brands = [
    ...new Set(products.map((p) => p.brand)),
  ].sort();

  const colors = [
    ...new Set(products.map((p) => p.color)),
  ].sort();

  const rams = [
    ...new Set(products.map((p) => parseInt(p.ram))),
  ].sort((a, b) => a - b);

  const prices = products.map((p) => p.newprice);

  const minprice = prices.length
    ? Math.min(...prices)
    : 0;

  const maxprice = prices.length
    ? Math.max(...prices)
    : 100000;

  const storages = [
    ...new Set(products.map((p) => p.storage)),
  ];

  const storagerange = (storage) =>
    storage >= 1024
      ? `${storage / 1024}TB`
      : `${storage}GB`;

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

  useEffect(() => {
    if (prices.length > 0) {
      setMaxSelected(maxprice);
    }
  }, [maxprice]);

  const filteredproducts = products.filter(
    (product) => {
      const priceMatch =
        product.newprice >= minprice &&
        product.newprice <= maxSelected;

      const brandMatch =
        selectedBrand.length === 0 ||
        selectedBrand.includes(product.brand);

        const colorMatch =
        selectedColor.length === 0 ||
        selectedColor.includes(product.color);

      return priceMatch && brandMatch && colorMatch;
    }
  );

  return (
    <div className="product-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="filtercontent">
          <div className="sidebar-header">
            <h3>Filters</h3>
            <span>Clear All</span>
          </div>

          <hr className="linesep" />

          {/* Categories */}
          <div className="filter-group">
            <h4>Categories</h4>

            {categories.map((category, index) => (
              <label key={index}>
                <input type="checkbox" /> {category}
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div className="pricerange">
            <h4>Price Range</h4>

            <input
              type="range"
              min={minprice}
              max={maxprice}
              value={maxSelected}
              onChange={(e) =>
                setMaxSelected(Number(e.target.value))
              }
            />

            <div className="rangevalue">
              <h5>₹ {minprice}</h5>
              <h5>₹ {maxSelected}</h5>
            </div>
          </div>

          {/* RAM */}
          <div className="ram">
            <h4>RAM</h4>

            <select>
              <option>Select RAM</option>

              {rams.map((ram, index) => (
                <option key={index}>
                  {ram}GB
                </option>
              ))}
            </select>
          </div>

          {/* Storage */}
          <div className="storage">
            <h4>Storage</h4>

            <select>
              <option>Select Storage</option>

              {storages.map((storage, index) => (
                <option key={index}>
                  {storagerange(storage)}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div className="filter-brand">
            <h4>Brand</h4>

            {brands.map((brand, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={selectedBrand.includes(
                    brand
                  )}
                  onChange={() =>
                    setSelectedBrand(
                      selectedBrand.includes(
                        brand
                      )
                        ? selectedBrand.filter(
                            (b) => b !== brand
                          )
                        : [
                            ...selectedBrand,
                            brand,
                          ]
                    )
                  }
                />

                {brand.charAt(0).toUpperCase() +
                  brand.slice(1)}
              </label>
            ))}
          </div>

          {/* Color */}
          <div className="filter-color">
            <h4>Color</h4>

            {colors.map((color, index) => (
              <label key={index}>
                <input type="checkbox" checked={selectedColor.includes(
                    color
                  )}
                  onChange={() =>
                    setSelectedColor(
                      selectedColor.includes(
                        color
                      )
                        ? selectedColor.filter(
                            (c) => c !== color
                          )
                        : [
                            ...selectedColor,
                            color,
                          ]
                    )
                  }/>{" "}
                {color.charAt(0).toUpperCase() +
                  color.slice(1)}
              </label>
            ))}
          </div>
          

          {/* Rating */}
          <div className="filter-rating">
            <h4>Rating ⭐⭐⭐⭐⭐</h4>

            <label>
              <input type="checkbox" /> 3.0 - 3.5
            </label>

            <label>
              <input type="checkbox" /> 3.5 - 4.0
            </label>

            <label>
              <input type="checkbox" /> 4.0 - 4.5
            </label>

            <label>
              <input type="checkbox" /> 4.5 - 5.0
            </label>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="products-section">
        <div className="heading">
          <h1>All Products</h1>

          <div className="filter-tags">
            <h4>Filters Applied:</h4>

            <span className="tag">
              Brand: Samsung ×
            </span>

            <span className="tag">
              Category: Electronics ×
            </span>

            <span className="tag">
              Price: ₹100 - ₹500 ×
            </span>
          </div>

          <p>
            Products Found (
            {filteredproducts.length})
          </p>
        </div>

        <div className="products-grid">
          {filteredproducts.map((product) => (
            <div
              key={product._id}
              className="product-tiles"
            >
              <div className="image-wrapper2">
                <img
                  src={product.image}
                  alt={product.name}
                />
              </div>

              <div className="product-info">
                <h1>{product.name}</h1>

                <div className="specs">
                  <span>{product.color}</span>
                  <span>Ram:{product.ram}</span>
                  <span>Storage:{storagerange(product.storage)}</span>
                </div>

                <div className="ratings">
                  ⭐ {product.rating} (
                  {product.review})
                </div>

                <div className="price-section">
                  <span className="old-price">
                    ₹{product.oldprice}
                  </span>

                  <span className="new-price">
                    ₹{product.newprice}
                  </span>
                </div>

                <button className="cartbtn" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
        </div>
      </div>
    </div>
  );
}

export default Product;
