import React, { useState, useEffect } from "react";

const API = "http://localhost:5000";

const statusMeta = {
  placed:    { label: "Placed",    bg: "#faeeda", color: "#854f0b", border: "#fac775" },
  confirmed: { label: "Confirmed", bg: "#e6f1fb", color: "#185fa5", border: "#b5d4f4" },
  pickedup:  { label: "Picked Up", bg: "#eaf3de", color: "#3B6D11", border: "#c0dd97" },
  cancelled: { label: "Cancelled", bg: "#faece7", color: "#993c1d", border: "#f5c4b3" },
};

const inputClass = {
  border: "1px solid #d4e8b0",
  background: "#f9fdf4",
  borderRadius: 12,
  padding: "12px 16px",
  fontSize: 14,
  color: "#27500a",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const FarmerDashboard = ({ user, onLogout, onViewProfile, onViewWallet, onViewForum }) => {
  const [activeTab, setActiveTab] = useState("listings");
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", pricePerUnit: "", location: "", category: "", unit: "kg" });
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchListings(); }, []);
  useEffect(() => { if (activeTab === "orders") fetchOrders(); }, [activeTab]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/products`, { headers: authHeader });
      const data = await res.json();
      setListings((data.products || []).filter(p => p.farmer._id === user?.id || p.farmer === user?.id));
    } catch { setError("Failed to load listings"); }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`${API}/api/orders/my`, { headers: authHeader });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch { setError("Failed to load orders"); }
    setOrdersLoading(false);
  };

  const handleAddListing = async () => {
    setError("");
    if (!form.name || !form.pricePerUnit || !form.quantity || !form.location || !form.category)
      return setError("Please fill all fields");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ name: form.name, category: form.category, quantity: Number(form.quantity), unit: form.unit, pricePerUnit: Number(form.pricePerUnit), location: form.location }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      setSuccess("Crop listed successfully!");
      setForm({ name: "", quantity: "", pricePerUnit: "", location: "", category: "", unit: "kg" });
      setActiveTab("listings");
      fetchListings();
    } catch { setError("Failed to add listing"); }
    setLoading(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const res = await fetch(`${API}/api/orders/${orderId}/confirm`, { method: "PUT", headers: authHeader });
      if (res.ok) { setSuccess("Order confirmed!"); fetchOrders(); setTimeout(() => setSuccess(""), 3000); }
    } catch { setError("Failed to confirm order"); }
  };

  const tabs = [
    { key: "listings", label: "My Listings", icon: "📋" },
    { key: "add",      label: "Add Crop",    icon: "➕" },
    { key: "orders",   label: "Orders",      icon: "📦" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f0f7e6 0%, #fffbf2 60%, #fff4ec 100%)" }}>

      {/* Navbar */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e2f0cc", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 12px #3B6D1110" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #eaf3de, #fef9ec)", border: "1px solid #c0dd97", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌾</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#27500a" }}>KisanConnect</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[
            { label: "💰 Wallet", fn: onViewWallet, bg: "#faeeda", border: "#fac775", color: "#854f0b" },
            { label: "💬 Forum",  fn: onViewForum,  bg: "#e6f1fb", border: "#b5d4f4", color: "#185fa5" },
            { label: "👤 Profile",fn: onViewProfile,bg: "#eaf3de", border: "#c0dd97", color: "#3B6D11" },
          ].map(({ label, fn, bg, border, color }) => (
            <button key={label} onClick={fn} style={{ fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8, border: `1px solid ${border}`, background: bg, color, cursor: "pointer" }}>
              {label}
            </button>
          ))}
          <span style={{ fontSize: 12, fontWeight: 500, padding: "6px 12px", borderRadius: 8, background: "#eaf3de", color: "#3B6D11", display: "flex", alignItems: "center", gap: 4 }}>
            🧑‍🌾 {user?.name}
          </span>
          <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); onLogout(); }}
            style={{ fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8, border: "1px solid #f5c4b3", background: "#faece7", color: "#993c1d", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #27500a 0%, #3B6D11 50%, #639922 100%)", padding: "32px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(circle at 85% 50%, #f59e0b, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 896, margin: "0 auto", position: "relative" }}>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>Welcome, {user?.name || "Farmer"}! 🌱</h1>
          <p style={{ color: "#c0dd97", fontSize: 13, marginTop: 4 }}>Manage your crops and orders from here</p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {[
              { label: "Listed Crops", val: listings.length },
              { label: "Pending Orders", val: orders.filter(o => o.status === "placed").length },
              { label: "Active", val: listings.filter(l => l.isAvailable).length },
            ].map(({ label, val }) => (
              <div key={label} style={{ padding: "8px 16px", borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", textAlign: "center" }}>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 18, margin: 0 }}>{val}</p>
                <p style={{ color: "#c0dd97", fontSize: 11, margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div style={{ maxWidth: 896, margin: "0 auto", padding: "0 24px" }}>
        {success && (
          <div style={{ marginTop: 16, background: "#eaf3de", border: "1px solid #c0dd97", color: "#3B6D11", fontSize: 13, borderRadius: 12, padding: "12px 16px" }}>
            ✅ {success}
          </div>
        )}
        {error && (
          <div style={{ marginTop: 16, background: "#faece7", border: "1px solid #f5c4b3", color: "#993c1d", fontSize: 13, borderRadius: 12, padding: "12px 16px" }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2f0cc", padding: "0 24px", display: "flex", gap: 4, marginTop: 16 }}>
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setError(""); }}
              style={{ padding: "12px 18px", fontSize: 13, fontWeight: 600, border: "none", borderBottom: active ? "2px solid #3B6D11" : "2px solid transparent", background: "transparent", color: active ? "#27500a" : "#9aab87", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 896, margin: "0 auto", padding: "24px" }}>

        {/* My Listings */}
        {activeTab === "listings" && (
          <div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }} className="animate-pulse">🌾</div>
                <p style={{ color: "#9aab87", fontSize: 13 }}>Loading your listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 0" }}>
                <p style={{ fontSize: 40, marginBottom: 8 }}>🌱</p>
                <p style={{ fontWeight: 600, color: "#3B6D11", fontSize: 15 }}>No listings yet</p>
                <p style={{ color: "#9aab87", fontSize: 13, marginTop: 4 }}>Add your first crop to get started</p>
                <button onClick={() => setActiveTab("add")} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 12, background: "linear-gradient(135deg, #3B6D11, #639922)", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", boxShadow: "0 3px 10px #3B6D1140" }}>
                  ➕ Add Crop
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {listings.map((item) => (
                  <div key={item._id} style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #e2f0cc", boxShadow: "0 2px 12px #3B6D1108" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eaf3de", border: "1px solid #c0dd97", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🌾</div>
                        <div>
                          <p style={{ fontWeight: 700, color: "#27500a", margin: 0, fontSize: 15 }}>{item.name}</p>
                          <p style={{ color: "#9aab87", fontSize: 11, margin: 0 }}>{item.category}</p>
                        </div>
                      </div>
                      <span style={item.isAvailable
                        ? { fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "#eaf3de", color: "#3B6D11", border: "1px solid #c0dd97" }
                        : { fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "#faece7", color: "#993c1d", border: "1px solid #f5c4b3" }}>
                        {item.isAvailable ? "● Active" : "● Sold Out"}
                      </span>
                    </div>
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #e2f0cc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: 12, color: "#9aab87", margin: 0 }}>📦 {item.quantity} {item.unit}  ·  📍 {item.location}</p>
                      </div>
                      <p style={{ fontWeight: 700, fontSize: 17, color: "#3B6D11", margin: 0 }}>₹{item.pricePerUnit}<span style={{ fontSize: 11, fontWeight: 400, color: "#9aab87" }}>/{item.unit}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Crop */}
        {activeTab === "add" && (
          <div style={{ maxWidth: 480 }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #e2f0cc", boxShadow: "0 2px 16px #3B6D1108" }}>
              <h2 style={{ color: "#27500a", fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>Add New Crop Listing</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { placeholder: "Crop Name (e.g. Wheat)", key: "name", type: "text" },
                  { placeholder: "Category (e.g. Grain, Vegetable)", key: "category", type: "text" },
                  { placeholder: "Price per unit (₹)", key: "pricePerUnit", type: "number" },
                  { placeholder: "Location (e.g. Ludhiana, Punjab)", key: "location", type: "text" },
                ].map(({ placeholder, key, type }) => (
                  <input key={key} type={type} placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={inputClass} />
                ))}

                <div style={{ display: "flex", gap: 10 }}>
                  <input type="number" placeholder="Quantity" value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    style={{ ...inputClass, flex: 1 }} />
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    style={{ ...inputClass, width: "auto", paddingRight: 12, cursor: "pointer" }}>
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                  </select>
                </div>

                <button onClick={handleAddListing} disabled={loading}
                  style={{ padding: "14px", borderRadius: 12, background: loading ? "#9aab87" : "linear-gradient(135deg, #3B6D11, #639922)", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 14px #3B6D1140", marginTop: 4 }}>
                  {loading ? "⏳ Adding..." : "➕ Add Listing"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div>
            {ordersLoading ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }} className="animate-pulse">📦</div>
                <p style={{ color: "#9aab87", fontSize: 13 }}>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 0" }}>
                <p style={{ fontSize: 40, marginBottom: 8 }}>📭</p>
                <p style={{ fontWeight: 600, color: "#3B6D11", fontSize: 15 }}>No orders yet</p>
                <p style={{ color: "#9aab87", fontSize: 13, marginTop: 4 }}>Orders from buyers will appear here</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {orders.map((order) => {
                  const sm = statusMeta[order.status] || { label: order.status, bg: "#f1efe8", color: "#5F5E5A", border: "#d3d1c7" };
                  return (
                    <div key={order._id} style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #e2f0cc", boxShadow: "0 2px 12px #3B6D1108" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <p style={{ fontWeight: 700, color: "#27500a", margin: 0, fontSize: 15 }}>
                            🌾 {order.product?.name} — {order.quantity} {order.product?.unit}
                          </p>
                          <p style={{ color: "#9aab87", fontSize: 12, marginTop: 4 }}>👤 Buyer: {order.buyer?.name}</p>
                          <p style={{ color: "#9aab87", fontSize: 12 }}>💳 {order.paymentMethod?.toUpperCase()}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontWeight: 700, fontSize: 18, color: "#3B6D11", margin: 0 }}>₹{order.totalPrice}</p>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: sm.bg, color: sm.color, border: `1px solid ${sm.border}`, display: "inline-block", marginTop: 6 }}>
                            {sm.label}
                          </span>
                        </div>
                      </div>
                      {order.status === "placed" && (
                        <button onClick={() => handleConfirmOrder(order._id)}
                          style={{ width: "100%", marginTop: 14, padding: "10px", borderRadius: 12, background: "linear-gradient(135deg, #3B6D11, #639922)", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", boxShadow: "0 3px 10px #3B6D1135" }}>
                          ✅ Confirm Order
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;