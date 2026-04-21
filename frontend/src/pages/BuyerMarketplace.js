import React, { useState } from 'react';

const crops = [
  { id: 1, crop: 'Wheat', farmer: 'Harjeet Singh', location: 'Ludhiana, Punjab', quantity: '10 Quintal', price: 2200, rating: 4.5 },
  { id: 2, crop: 'Wheat', farmer: 'Balwinder Kumar', location: 'Amritsar, Punjab', quantity: '5 Quintal', price: 2050, rating: 4.2 },
  { id: 3, crop: 'Wheat', farmer: 'Sukhdev Yadav', location: 'Karnal, Haryana', quantity: '8 Quintal', price: 2300, rating: 4.8 },
  { id: 4, crop: 'Tomato', farmer: 'Ramesh Patel', location: 'Agra, UP', quantity: '3 Quintal', price: 800, rating: 4.0 },
  { id: 5, crop: 'Tomato', farmer: 'Suresh Verma', location: 'Mathura, UP', quantity: '6 Quintal', price: 750, rating: 4.3 },
  { id: 6, crop: 'Rice', farmer: 'Gurpreet Singh', location: 'Patiala, Punjab', quantity: '15 Quintal', price: 3200, rating: 4.6 },
  { id: 7, crop: 'Rice', farmer: 'Mohan Lal', location: 'Ambala, Haryana', quantity: '10 Quintal', price: 3100, rating: 4.1 },
];

const BuyerMarketplace = ({ user, onLogout, onOrder, onViewChart }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Wheat', 'Tomato', 'Rice'];

  const filtered = crops.filter((c) => {
    const matchCategory = category === 'All' || c.crop === category;
    const matchSearch = c.crop.toLowerCase().includes(search.toLowerCase()) ||
      c.farmer.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const cheapest = {};
  crops.forEach((c) => {
    if (!cheapest[c.crop] || c.price < cheapest[c.crop]) {
      cheapest[c.crop] = c.price;
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
          <button
            onClick={onViewChart}
            className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-lg border border-green-200"
          >
            📈 Price Trends
          </button>
          <span className="text-sm text-gray-500">🛒 {user?.email}</span>
          <button
            onClick={onLogout}
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
        <p className="text-sm text-gray-500 mb-4">{filtered.length} listings found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow p-5 border border-gray-100 relative">
              {item.price === cheapest[item.crop] && (
                <span className="absolute top-3 right-3 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                  🏷️ Cheapest
                </span>
              )}
              <h3 className="font-bold text-gray-800 text-lg">🌾 {item.crop}</h3>
              <p className="text-sm text-gray-500 mt-1">👨‍🌾 {item.farmer}</p>
              <p className="text-sm text-gray-500">📍 {item.location}</p>
              <p className="text-sm text-gray-500">📦 {item.quantity}</p>
              <div className="flex justify-between items-center mt-3">
                <p className="text-green-600 font-bold text-lg">₹{item.price}/q</p>
                <p className="text-yellow-500 text-sm">⭐ {item.rating}</p>
              </div>
              <button
                onClick={() => onOrder(item)}
                className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-sm"
              >
                Place Order
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default BuyerMarketplace;