import React from 'react';

const FarmerProfile = ({ user, onBack }) => {
  const stats = [
    { label: 'Total Listings', value: '2', icon: '📋' },
    { label: 'Orders Received', value: '5', icon: '📦' },
    { label: 'Total Earnings', value: '₹18,400', icon: '💰' },
    { label: 'Rating', value: '4.5 ⭐', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9]">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="text-xl font-bold text-green-700">KisanConnect</span>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-green-700 border border-green-300 px-3 py-1 rounded-lg"
        >
          ← Back
        </button>
      </nav>

      {/* Profile Header */}
      <div className="bg-green-700 text-white px-6 py-8 text-center">
        <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-3">
          🧑‍🌾
        </div>
        <h1 className="text-2xl font-bold">{user?.name || 'Farmer'}</h1>
        <p className="text-green-200 text-sm mt-1">{user?.email}</p>
        <span className="mt-2 inline-block bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
          Verified Farmer ✅
        </span>
      </div>

      <div className="px-6 py-6 max-w-2xl mx-auto">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-5 text-center border border-gray-100">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-green-700">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Farm Details */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-bold text-green-700 mb-4">Farm Details</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Farm Location', value: 'Ludhiana, Punjab' },
              { label: 'Farm Size', value: '5 Acres' },
              { label: 'Main Crops', value: 'Wheat, Rice, Tomato' },
              { label: 'Member Since', value: 'April 2026' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-green-700 mb-4">Recent Activity</h2>
          {[
            { action: 'New order received', detail: 'Wheat — 2 Quintal by Rahul Sharma', time: '2 hrs ago', color: 'bg-green-100 text-green-700' },
            { action: 'Listing updated', detail: 'Tomato price changed to ₹800/q', time: '1 day ago', color: 'bg-blue-100 text-blue-700' },
            { action: 'Order completed', detail: 'Rice — 5 Quintal delivered', time: '3 days ago', color: 'bg-orange-100 text-orange-700' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 mb-4">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.color}`}>
                {item.action}
              </span>
              <div>
                <p className="text-sm text-gray-700">{item.detail}</p>
                <p className="text-xs text-gray-400 mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FarmerProfile;