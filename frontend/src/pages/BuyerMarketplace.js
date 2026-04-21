import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

const BuyerMarketplace = ({ user, onLogout, onOrder, onViewChart }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `${API}/api/products`;
      if (category !== 'All') url += `?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setError('Failed to load products. Make sure backend is running.');
    }
    setLoading(false);
  };

  const categories = ['All', 'Grain', 'Vegetable', 'Fruit', 'Rice'];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.farmer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  // Find cheapest price per crop name
  const cheapest = {};
  products.forEach((p) => {
    if (!cheapest[p.name] || p.pricePerUnit < cheapest[p.name]) {
      cheapest[p.name] = p.pricePerUnit;
    }
  });

  return (
    <div className="min-h-screen bg-[#fafaf9]">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="text-xl font-bold text-green-700">KisanConnect</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onViewForum}>💬 Forum</button>
          <button
            onClick={onViewChart}
            className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-lg border border-green-200"
          >
            📈 Price Trends
          </button>
          <span className="text-sm text-gray-500 hidden sm:block">🛒 {user?.name}</span>
          <button
            onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); onLogout(); }}
            className="text-sm bg-red-50 text-red-500 px-3 py-1 rounded-lg border border-red-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-green-700 text-white px-6 py-6">
        <h1 className="text-2xl font-bold">Buyer Marketplace 🛒</h1>
        <p className="text-green-200 text-sm mt-1">Compare prices directly from farmers</p>
      </div>

      {/* Search + Filter */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <input
          type="text"
          placeholder="🔍 Search crop, farmer or location..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1 rounded-full text-sm font-medium border transition-all ${
                category === cat
                  ? 'bg-green-600 text-white border-green-600'
                  : 'text-green-700 border-green-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div className="px-6 py-6 max-w-5xl mx-auto">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">⏳ Loading products...</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{filtered.length} listings found</p>
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No crops found. Try a different search or category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => (
                  <div key={item._id} className="bg-white rounded-2xl shadow p-5 border border-gray-100 relative">
                    {item.pricePerUnit === cheapest[item.name] && (
                      <span className="absolute top-3 right-3 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                        🏷️ Cheapest
                      </span>
                    )}
                    <h3 className="font-bold text-gray-800 text-lg">🌾 {item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">👨‍🌾 {item.farmer?.name || 'Farmer'}</p>
                    <p className="text-sm text-gray-500">📍 {item.location}</p>
                    <p className="text-sm text-gray-500">📦 {item.quantity} {item.unit}</p>
                    <p className="text-sm text-gray-500">⭐ {item.farmer?.rating?.toFixed(1) || '—'}</p>
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-green-600 font-bold text-lg">₹{item.pricePerUnit}/{item.unit}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {item.isAvailable ? 'Available' : 'Sold Out'}
                      </span>
                    </div>
                    <button
                      onClick={() => onOrder(item)}
                      disabled={!item.isAvailable}
                      className="w-full mt-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-2 rounded-xl text-sm"
                    >
                      {item.isAvailable ? 'Place Order' : 'Sold Out'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuyerMarketplace;