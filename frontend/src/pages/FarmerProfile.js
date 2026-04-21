import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

const FarmerProfile = ({ user, onBack }) => {
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Fetch products, orders and wallet in parallel
      const [productsRes, ordersRes, walletRes] = await Promise.all([
        fetch(`${API}/api/products`, { headers: authHeader }),
        fetch(`${API}/api/orders/my`, { headers: authHeader }),
        fetch(`${API}/api/wallet`, { headers: authHeader }),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const walletData = await walletRes.json();

      // Filter only this farmer's listings
      const myListings = (productsData.products || []).filter(
        (p) => p.farmer?._id === user?.id || p.farmer === user?.id
      );

      setListings(myListings);
      setOrders(ordersData.orders || []);
      setWallet(walletData.wallet || null);
    } catch {
      // silently fail, show zeros
    }
    setLoading(false);
  };

  const completedOrders = orders.filter((o) => o.status === 'pickedup').length;
  const totalEarnings = wallet?.balance || 0;

  const stats = [
    { label: 'Total Listings', value: listings.length.toString(), icon: '📋' },
    { label: 'Orders Received', value: orders.length.toString(), icon: '📦' },
    { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}`, icon: '💰' },
    { label: 'Completed Orders', value: completedOrders.toString(), icon: '✅' },
  ];

  const recentOrders = orders.slice(0, 3);

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

        {loading ? (
          <p className="text-center text-gray-400 text-sm py-8">⏳ Loading profile...</p>
        ) : (
          <>
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

            {/* Wallet Balance */}
            {wallet && (
              <div className="bg-green-700 text-white rounded-2xl shadow p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-green-200 text-sm">Wallet Balance</p>
                    <p className="text-3xl font-bold mt-1">₹{wallet.balance.toLocaleString()}</p>
                  </div>
                  <span className="text-5xl">💰</span>
                </div>
                <p className="text-green-200 text-xs mt-3">
                  {wallet.transactions?.length || 0} transactions recorded
                </p>
              </div>
            )}

            {/* Farm Details */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-gray-100">
              <h2 className="text-lg font-bold text-green-700 mb-4">Account Details</h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Name', value: user?.name || '—' },
                  { label: 'Email', value: user?.email || '—' },
                  { label: 'Role', value: 'Farmer' },
                  { label: 'Active Listings', value: listings.filter(l => l.isAvailable).length },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-green-700 mb-4">Recent Orders</h2>
              {recentOrders.length === 0 ? (
                <p className="text-gray-400 text-sm">No orders yet.</p>
              ) : (
                recentOrders.map((order, i) => (
                  <div key={i} className="flex items-start justify-between mb-4 pb-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        🌾 {order.product?.name} — {order.quantity} {order.product?.unit}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Buyer: {order.buyer?.name || '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-700">₹{order.totalPrice}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'placed' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'pickedup' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default FarmerProfile;