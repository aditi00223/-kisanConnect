import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FarmerDashboard = ({ user, onLogout, onViewProfile }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('listings');
  const [orderStatus, setOrderStatus] = useState('Pending');
  const [listings, setListings] = useState([
    { id: 1, crop: 'Wheat', quantity: '5 Quintal', price: '2200', status: 'Active' },
    { id: 2, crop: 'Tomato', quantity: '2 Quintal', price: '800', status: 'Active' },
  ]);
  const [form, setForm] = useState({ crop: '', quantity: '', price: '', location: '' });

  const handleAddListing = () => {
    if (!form.crop || !form.price || !form.quantity) return alert('Please fill all fields');
    setListings([...listings, { id: Date.now(), ...form, status: 'Active' }]);
    setForm({ crop: '', quantity: '', price: '', location: '' });
    setActiveTab('listings');
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
          <button onClick={onViewProfile} className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-lg border border-green-200">
            👤 {t('myProfile')}
          </button>
          <span className="text-sm text-gray-500">🧑‍🌾 {user?.email}</span>
          <button onClick={onLogout} className="text-sm bg-red-50 text-red-500 px-3 py-1 rounded-lg border border-red-200">
            {t('logout')}
          </button>
        </div>
      </nav>

      {/* Welcome Banner */}
      <div className="bg-green-700 text-white px-6 py-6">
        <h1 className="text-2xl font-bold">{t('welcomeFarmer')} 🌱</h1>
        <p className="text-green-200 text-sm mt-1">{t('manageCrops')}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6">
        {[
          { key: 'listings', label: `📋 ${t('myListings')}` },
          { key: 'add', label: `➕ ${t('addCrop')}` },
          { key: 'orders', label: `📦 ${t('incomingOrders')}` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">

        {/* My Listings */}
        {activeTab === 'listings' && (
          <div>
            <h2 className="text-lg font-bold text-green-700 mb-4">{t('myListings')}</h2>
            {listings.length === 0 ? (
              <p className="text-gray-400 text-sm">No listings yet. Add your first crop!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listings.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow p-5 border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">🌾 {item.crop}</h3>
                        <p className="text-sm text-gray-500 mt-1">{t('quantity')}: {item.quantity}</p>
                        <p className="text-sm text-gray-500">{t('location')}: {item.location || 'Not set'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 font-bold text-lg">₹{item.price}/q</p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {t('active')}
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
        {activeTab === 'add' && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-md">
            <h2 className="text-lg font-bold text-green-700 mb-4">{t('addCrop')}</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder={t('cropName')}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
                value={form.crop}
                onChange={(e) => setForm({ ...form, crop: e.target.value })}
              />
              <input
                type="text"
                placeholder={t('quantity')}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
              <input
                type="number"
                placeholder={t('price')}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <input
                type="text"
                placeholder={t('location')}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <button
                onClick={handleAddListing}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm"
              >
                ➕ {t('addListing')}
              </button>
            </div>
          </div>
        )}

        {/* Incoming Orders */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-lg font-bold text-green-700 mb-4">{t('incomingOrders')}</h2>
            <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">🌾 Wheat — 2 Quintal</h3>
                  <p className="text-sm text-gray-500 mt-1">Buyer: Rahul Sharma</p>
                  <p className="text-sm text-gray-500">Payment: UPI</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold">₹4400</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    orderStatus === 'Confirmed' ? 'bg-green-100 text-green-700' :
                    orderStatus === 'Rejected' ? 'bg-red-100 text-red-500' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {t(orderStatus.toLowerCase())}
                  </span>
                </div>
              </div>
              {orderStatus === 'Pending' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setOrderStatus('Confirmed')}
                    className="flex-1 bg-green-600 text-white text-sm py-2 rounded-xl font-medium"
                  >
                    ✅ {t('confirm')}
                  </button>
                  <button
                    onClick={() => setOrderStatus('Rejected')}
                    className="flex-1 bg-red-50 text-red-500 text-sm py-2 rounded-xl font-medium border border-red-200"
                  >
                    ❌ {t('reject')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FarmerDashboard;