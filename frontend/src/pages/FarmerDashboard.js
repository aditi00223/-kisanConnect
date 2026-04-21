import React, { useState, useEffect } from 'react';
import api from '../api';

const FarmerDashboard = ({ user, onLogout, onViewProfile }) => {
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({ crop: '', quantity: '', price: '', location: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/products/my');
        setListings(res.data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleAddListing = async () => {
    if (!form.crop || !form.price || !form.quantity) return alert('Please fill all fields');
    try {
      const res = await api.post('/products', form);
      setListings([...listings, res.data]);
      setForm({ crop: '', quantity: '', price: '', location: '' });
      setActiveTab('listings');
      alert('Crop listed successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add listing');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">Farmer Dashboard</h1>
          <div className="flex gap-3">
            <button onClick={onViewProfile} className="text-sm text-green-600 border border-green-600 px-3 py-1 rounded-lg">Profile</button>
            <button onClick={onLogout} className="text-sm text-red-500">Logout</button>
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'listings' ? 'bg-green-600 text-white' : 'bg-white border'}`}>
            My Listings
          </button>
          <button onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'add' ? 'bg-green-600 text-white' : 'bg-white border'}`}>
            + Add Crop
          </button>
        </div>

        {activeTab === 'listings' && (
          <div>
            {loading ? <p>Loading...</p> : listings.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No listings yet. Add your first crop!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map(item => (
                  <div key={item._id || item.id} className="bg-white rounded-xl shadow p-4">
                    <h2 className="text-lg font-bold text-green-700">{item.crop}</h2>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Location: {item.location}</p>
                    <p className="text-lg font-bold text-green-600 mt-2">₹{item.price}/quintal</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{item.status || 'Active'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4 text-green-700">Add New Crop</h2>
            <input className="w-full border rounded-lg px-4 py-2 mb-3" placeholder="Crop Name (e.g. Wheat)"
              value={form.crop} onChange={e => setForm({ ...form, crop: e.target.value })} />
            <input className="w-full border rounded-lg px-4 py-2 mb-3" placeholder="Quantity (e.g. 5 Quintal)"
              value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
            <input className="w-full border rounded-lg px-4 py-2 mb-3" placeholder="Price per Quintal (₹)"
              value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input className="w-full border rounded-lg px-4 py-2 mb-3" placeholder="Location"
              value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <button onClick={handleAddListing}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold">
              List Crop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;