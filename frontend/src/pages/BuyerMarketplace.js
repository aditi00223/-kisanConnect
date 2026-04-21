import React, { useState, useEffect } from 'react';
import api from '../api';

const BuyerMarketplace = ({ user, onLogout, onOrder, onViewChart }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Wheat', 'Tomato', 'Rice'];

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await api.get('/products');
        setCrops(res.data);
      } catch (err) {
        console.error('Failed to fetch crops:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  const filtered = crops.filter((c) => {
    const matchCategory = category === 'All' || c.crop === category;
    const matchSearch = c.crop.toLowerCase().includes(search.toLowerCase()) ||
      c.farmer?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) return <div className="text-center p-10">Loading crops...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">Buyer Marketplace</h1>
          <button onClick={onLogout} className="text-sm text-red-500">Logout</button>
        </div>
        <input className="w-full border rounded-lg px-4 py-2 mb-4"
          placeholder="Search crop or farmer..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex gap-2 mb-4">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-1 rounded-full text-sm ${category === cat ? 'bg-green-600 text-white' : 'bg-white border'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(crop => (
            <div key={crop._id || crop.id} className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-bold text-green-700">{crop.crop}</h2>
              <p className="text-sm text-gray-500">Farmer: {crop.farmer}</p>
              <p className="text-sm text-gray-500">Location: {crop.location}</p>
              <p className="text-sm text-gray-500">Quantity: {crop.quantity}</p>
              <p className="text-lg font-bold text-green-600 mt-2">₹{crop.price}/quintal</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => onOrder(crop)}
                  className="flex-1 bg-green-600 text-white py-1 rounded-lg text-sm">
                  Order
                </button>
                <button onClick={() => onViewChart(crop.crop)}
                  className="flex-1 border border-green-600 text-green-600 py-1 rounded-lg text-sm">
                  Price Trend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerMarketplace;