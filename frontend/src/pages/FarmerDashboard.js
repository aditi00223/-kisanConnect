import React, { useState, useEffect } from "react";

const API = "http://localhost:5000";

const FarmerDashboard = ({ user, onLogout, onViewProfile }) => {
  const [activeTab, setActiveTab] = useState("listings");
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    pricePerUnit: "",
    location: "",
    category: "",
    unit: "kg",
  });
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { Authorization: `Bearer ${token}` };

  // Fetch listings on mount
  useEffect(() => {
    fetchListings();
  }, []);

  // Fetch orders when tab changes
  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/products`, { headers: authHeader });
      const data = await res.json();
      // Filter only this farmer's listings
      const myListings = data.products.filter(
        (p) => p.farmer._id === user?.id || p.farmer === user?.id,
      );
      setListings(myListings);
    } catch {
      setError("Failed to load listings");
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`${API}/api/orders/my`, { headers: authHeader });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setError("Failed to load orders");
    }
    setOrdersLoading(false);
  };

  const handleAddListing = async () => {
    setError("");
    if (
      !form.name ||
      !form.pricePerUnit ||
      !form.quantity ||
      !form.location ||
      !form.category
    ) {
      return setError("Please fill all fields");
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          quantity: Number(form.quantity),
          unit: form.unit,
          pricePerUnit: Number(form.pricePerUnit),
          location: form.location,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setSuccess("Crop listed successfully! ✅");
      setForm({
        name: "",
        quantity: "",
        pricePerUnit: "",
        location: "",
        category: "",
        unit: "kg",
      });
      setActiveTab("listings");
      fetchListings();
    } catch {
      setError("Failed to add listing");
    }
    setLoading(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const res = await fetch(`${API}/api/orders/${orderId}/confirm`, {
        method: "PUT",
        headers: authHeader,
      });
      if (res.ok) {
        setSuccess("Order confirmed! ✅");
        fetchOrders();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch {
      setError("Failed to confirm order");
    }
  };

  const statusColor = (status) => {
    if (status === "placed") return "bg-yellow-100 text-yellow-700";
    if (status === "confirmed") return "bg-blue-100 text-blue-700";
    if (status === "pickedup") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="text-xl font-bold text-green-700">KisanConnect</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onViewWallet}>💰 Wallet</button>
          <button onClick={onViewForum}>💬 Forum</button>
          <button
            onClick={onViewProfile}
            className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-lg border border-green-200"
          >
            👤 My Profile
          </button>
          <span className="text-sm text-gray-500 hidden sm:block">
            🧑‍🌾 {user?.name}
          </span>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              onLogout();
            }}
            className="text-sm bg-red-50 text-red-500 px-3 py-1 rounded-lg border border-red-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Welcome Banner */}
      <div className="bg-green-700 text-white px-6 py-6">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.name || "Farmer"}! 🌱
        </h1>
        <p className="text-green-200 text-sm mt-1">
          Manage your crops and orders from here
        </p>
      </div>

      {/* Success / Error */}
      {success && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          {success}
        </div>
      )}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6">
        {[
          { key: "listings", label: "📋 My Listings" },
          { key: "add", label: "➕ Add Crop" },
          { key: "orders", label: "📦 Incoming Orders" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setError("");
            }}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? "border-green-600 text-green-700"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">
        {/* My Listings */}
        {activeTab === "listings" && (
          <div>
            <h2 className="text-lg font-bold text-green-700 mb-4">
              My Crop Listings
            </h2>
            {loading ? (
              <p className="text-gray-400 text-sm">Loading listings...</p>
            ) : listings.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No listings yet. Add your first crop!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listings.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl shadow p-5 border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          🌾 {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Qty: {item.quantity} {item.unit}
                        </p>
                        <p className="text-sm text-gray-500">
                          📍 {item.location}
                        </p>
                        <p className="text-sm text-gray-500">
                          Category: {item.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 font-bold text-lg">
                          ₹{item.pricePerUnit}/{item.unit}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${item.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                        >
                          {item.isAvailable ? "Active" : "Sold Out"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Crop Form */}
        {activeTab === "add" && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-md">
            <h2 className="text-lg font-bold text-green-700 mb-4">
              Add New Crop Listing
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Crop Name (e.g. Wheat, Tomato)"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category (e.g. Grain, Vegetable)"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Quantity"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                />
                <select
                  className="border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-green-400"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="ton">ton</option>
                </select>
              </div>
              <input
                type="number"
                placeholder="Price per unit (₹)"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
                value={form.pricePerUnit}
                onChange={(e) =>
                  setForm({ ...form, pricePerUnit: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Farm Location (e.g. Ludhiana, Punjab)"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <button
                onClick={handleAddListing}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-3 rounded-xl text-sm"
              >
                {loading ? "⏳ Adding..." : "➕ Add Listing"}
              </button>
            </div>
          </div>
        )}

        {/* Incoming Orders */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-lg font-bold text-green-700 mb-4">
              Incoming Orders
            </h2>
            {ordersLoading ? (
              <p className="text-gray-400 text-sm">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-400 text-sm">No orders yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl shadow p-5 border border-gray-100"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-800">
                          🌾 {order.product?.name} — {order.quantity}{" "}
                          {order.product?.unit}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Buyer: {order.buyer?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Payment: {order.paymentMethod?.toUpperCase()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 font-bold">
                          ₹{order.totalPrice}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${statusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    {order.status === "placed" && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleConfirmOrder(order._id)}
                          className="flex-1 bg-green-600 text-white text-sm py-2 rounded-xl font-medium"
                        >
                          ✅ Confirm
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
