import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Product.css";

const API_BASE_URL = "https://ecommerce-backend-p1dv.onrender.com";

function Product({
  selectedBrand = [],
  setSelectedBrand = () => {},

  selectedColor = [],
  setSelectedColor = () => {},
}) {
  const [products, setProducts] = useState([]);
  const [maxSelected, setMaxSelected] = useState(100000);

  // FETCH PRODUCTS
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/products`)
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setProducts(data);
      })
      .catch((err) => console.log(err));
  }, []);

  // SAFE ARRAY
  const safeProducts = Array.isArray(products) ? products : [];

  // FILTER OPTIONS (SAFE)
  const categories = [...new Set(safeProducts.map((p) => p?.category).filter(Boolean))].sort();

  const brands = [...new Set(safeProducts.map((p) => p?.brand).filter(Boolean))].sort();

  const colors = [...new Set(safeProducts.map((p) => p?.color).filter(Boolean))].sort();

  const rams = [
    ...new Set(
      safeProducts.map((p) => Number(p?.ram)).filter((r) => !isNaN(r))
    ),
  ].sort((a, b) => a - b);

  const prices = safeProducts.map((p) => p?.newprice || 0);

  const minprice = prices.length ? Math.min(...prices) : 0;
  const maxprice = prices.length ? Math.max(...prices) : 100000;

  const storages = [...new Set(safeProducts.map((p) => p?.storage).filter(Boolean))];

  const storagerange = (storage) =>
    storage >= 1024 ? `${storage / 1024}TB` : `${storage}GB`;

  // CART
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product?.name || "Item"} added to cart!`);
  };

  // INIT PRICE SLIDER
  useEffect(() => {
    if (prices.length > 0) {
      setMaxSelected(maxprice);
    }
  }, [maxprice]); // eslint-disable-line

  // FILTERED PRODUCTS
  const filteredproducts = safeProducts.filter((product) => {
    const price = product?.newprice || 0;

    const priceMatch = price >= minprice && price <= maxSelected;

    const brandMatch =
      selectedBrand.length === 0 ||
      selectedBrand.includes(product?.brand);

    const colorMatch =
      selectedColor.length === 0 ||
      selectedColor.includes(product?.color);

    return priceMatch && brandMatch && colorMatch;
  });

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

          {/* CATEGORY */}
          <div className="filter-group">
            <h4>Categories</h4>
            {categories.map((category, index) => (
              <label key={index}>
                <input type="checkbox" /> {category}
              </label>
            ))}
          </div>

          {/* PRICE */}
          <div className="pricerange">
            <h4>Price Range</h4>

            <input
              type="range"
              min={minprice}
              max={maxprice}
              value={maxSelected}
              onChange={(e) => setMaxSelected(Number(e.target.value))}
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
                <option key={index}>{ram}GB</option>
              ))}
            </select>
          </div>

          {/* STORAGE */}
          <div className="storage">
            <h4>Storage</h4>
            <select>
              <option>Select Storage</option>
              {storages.map((storage, index) => (
                <option key={index}>{storagerange(storage)}</option>
              ))}
            </select>
          </div>

          {/* BRAND */}
          <div className="filter-brand">
            <h4>Brand</h4>

            {brands.map((brand, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={selectedBrand.includes(brand)}
                  onChange={() =>
                    setSelectedBrand(
                      selectedBrand.includes(brand)
                        ? selectedBrand.filter((b) => b !== brand)
                        : [...selectedBrand, brand]
                    )
                  }
                />

                {brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : ""}
              </label>
            ))}
          </div>

          {/* COLOR */}
          <div className="filter-color">
            <h4>Color</h4>

            {colors.map((color, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={selectedColor.includes(color)}
                  onChange={() =>
                    setSelectedColor(
                      selectedColor.includes(color)
                        ? selectedColor.filter((c) => c !== color)
                        : [...selectedColor, color]
                    )
                  }
                />

                {color ? color.charAt(0).toUpperCase() + color.slice(1) : ""}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="products-section">
        <div className="heading">
          <h1>All Products</h1>

          <p>Products Found ({filteredproducts.length})</p>
        </div>

        <div className="products-grid">
          {filteredproducts.map((product) => (
            <div key={product?._id} className="product-tiles">
              <div className="image-wrapper2">
                <img src={product?.image} alt={product?.name || "product"} />
              </div>

              <div className="product-info">
                <h1>{product?.name || "Unnamed Product"}</h1>

                <div className="specs">
                  <span>{product?.color || "N/A"}</span>
                  <span>RAM: {product?.ram || "-"}</span>
                  <span>
                    Storage: {storagerange(product?.storage || 0)}
                  </span>
                </div>

                <div className="ratings">
                  ⭐ {product?.rating || 0} ({product?.review || 0})
                </div>

                <div className="price-section">
                  <span className="old-price">₹{product?.oldprice || 0}</span>
                  <span className="new-price">₹{product?.newprice || 0}</span>
                </div>

                <button
                  className="cartbtn"
                  onClick={() => addToCart(product)}
                >
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