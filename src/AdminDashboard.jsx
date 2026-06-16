import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const API_BASE_URL =
  "https://ecommerce-backend-p1dv.onrender.com";

  const emptyForm = {
    name: "",
    description: "",
    category: "laptops",
    oldprice: "",
    newprice: "",
    stock: "",
    maxStock: "100",
    specs: {
      processor: "",
      ram: "",
      storage: "",
      graphics: "",
      fps: "",
      refreshRate: ""
    },
    image: ""
  };

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showStockForm, setShowStockForm] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState(null);
  const [stockQuantity, setStockQuantity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalProductsSold: 0,
    totalStock: 0,
    lowStockProducts: []
  });

  // ✅ SAFE TOKEN
  const getToken = () => localStorage.getItem("userToken");

  // AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");

    if (!token || !role) return navigate("/login");
    if (role !== "admin" && role !== "superadmin") return navigate("/");
  }, [navigate]);

  // LOAD DATA
  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load products");
    }
  };

  // FETCH STATS
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      const data = await res.json();
      setStats(data);
    } catch {
      console.log("Stats error");
    }
  };

  // INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("specs.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        specs: { ...prev.specs, [key]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ADD / EDIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEdit = Boolean(editingId);

      const url = isEdit
        ? `${API_BASE_URL}/api/products/${editingId}`
        : `${API_BASE_URL}/api/products`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          ...formData,
          oldprice: Number(formData.oldprice),
          newprice: Number(formData.newprice),
          stock: Number(formData.stock),
          maxStock: Number(formData.maxStock)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(isEdit ? "Updated successfully" : "Added successfully");

      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);

      fetchProducts();
      fetchStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // EDIT
  const handleEdit = (p) => {
    setEditingId(p._id);

    setFormData({
      name: p.name || "",
      description: p.description || "",
      category: p.category || "laptops",
      oldprice: p.oldprice || "",
      newprice: p.newprice || "",
      stock: p.stock || "",
      maxStock: p.maxStock || 100,
      specs: p.specs || {},
      image: p.image || ""
    });

    setShowForm(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setProducts((prev) => prev.filter((p) => p._id !== id));

      setSuccess("Deleted successfully");
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  // STOCK UPDATE
  const handleStockUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/products/${selectedProductForStock._id}/update-stock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify({
            quantity: Number(stockQuantity)
          })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Stock updated");

      setShowStockForm(false);
      setStockQuantity("");
      setSelectedProductForStock(null);

      fetchProducts();
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="admin-header">
        <h1>🎮 Admin Dashboard</h1>

        <div className="header-actions">
          <button className="btn-add" onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}>
            ➕ Add Product
          </button>

          <button className="btn-logout" onClick={() => {
            localStorage.clear();
            navigate("/");
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* ERROR / SUCCESS */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* PRODUCTS */}
      <div className="products-section">
        <h2>📦 Products ({products.length})</h2>

        <div className="products-grid">
          {products.map((p) => (
            <div className="product-card" key={p._id}>
              <img src={p.image} alt={p.name} />

              <div className="product-info">
                <h3>{p.name}</h3>
                <p className="category">{p.category}</p>

                <div className="price-section">
                  <span className="old-price">₹{p.oldprice}</span>
                  <span className="new-price">₹{p.newprice}</span>
                </div>

                <div className="actions">
                  <button onClick={() => {
                    setSelectedProductForStock(p);
                    setShowStockForm(true);
                  }}>
                    Stock
                  </button>

                  <button onClick={() => handleEdit(p)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(p._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
{showForm && (
  <div className="modal">
    <form className="form" onSubmit={handleSubmit}>
      <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

      {/* NAME */}
      <label>Product Name</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter product name"
        required
      />

      {/* DESCRIPTION */}
      <label>Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Enter product description"
        rows={3}
        required
      />

      {/* PRICE */}
      <label>Old Price</label>
      <input
        type="number"
        name="oldprice"
        value={formData.oldprice}
        onChange={handleInputChange}
        placeholder="Enter original price"
        required
      />

      <label>New Price</label>
      <input
        type="number"
        name="newprice"
        value={formData.newprice}
        onChange={handleInputChange}
        placeholder="Enter sale price"
        required
      />

      {/* STOCK */}
      <label>Stock</label>
      <input
        type="number"
        name="stock"
        value={formData.stock}
        onChange={handleInputChange}
        placeholder="Enter stock quantity"
        required
      />

      {/* IMAGE */}
      <label>Image URL</label>
      <input
        name="image"
        value={formData.image}
        onChange={handleInputChange}
        placeholder="https://example.com/image.jpg"
        required
      />

      {/* BUTTONS */}
      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            setEditingId(null);
            setFormData(emptyForm);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

      {/* STOCK */}
      {showStockForm && (
        <div className="modal">
          <form className="form" onSubmit={handleStockUpdate}>
            <h2>Update Stock</h2>

            <input
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder="Enter quantity"
            />

            <button type="submit">Update</button>

            <button type="button" onClick={() => setShowStockForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;