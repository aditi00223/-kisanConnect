import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const API = 'http://localhost:5000';

const DemandChart = ({ onBack }) => {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const crops = ['Wheat', 'Rice', 'Maize', 'Mustard'];

  useEffect(() => {
    fetchPrices();
  }, [selectedCrop]);

  const fetchPrices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/prices?crop=${selectedCrop}`);
      const data = await res.json();

      if (!res.ok) { setError('Failed to load price data'); setLoading(false); return; }

      // Format for recharts
      const formatted = data.prices.map((p) => ({
        month: new Date(p.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
        price: p.price,
      }));

      setChartData(formatted);
    } catch {
      setError('Cannot connect to server.');
    }
    setLoading(false);
  };

  const latestPrice = chartData[chartData.length - 1]?.price;
  const firstPrice = chartData[0]?.price;
  const trend = latestPrice && firstPrice
    ? (((latestPrice - firstPrice) / firstPrice) * 100).toFixed(1)
    : null;

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

      {/* Header */}
      <div className="bg-green-700 text-white px-6 py-6">
        <h1 className="text-2xl font-bold">Demand Forecasting 📈</h1>
        <p className="text-green-200 text-sm mt-1">Real crop price trends from database</p>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">

        {/* Crop Selector */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {crops.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                selectedCrop === crop
                  ? 'bg-green-600 text-white border-green-600'
                  : 'text-green-700 border-green-300'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Stats Row */}
        {!loading && chartData.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow p-4 text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Current Price</p>
              <p className="text-xl font-bold text-green-700">₹{latestPrice}</p>
              <p className="text-xs text-gray-400">per unit</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4 text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">6-Month Trend</p>
              <p className={`text-xl font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {trend >= 0 ? '📈' : '📉'} {trend}%
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4 text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Data Points</p>
              <p className="text-xl font-bold text-orange-600">{chartData.length}</p>
              <p className="text-xs text-gray-400">months</p>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-green-700 mb-4">
            {selectedCrop} Price Trend (₹/unit)
          </h2>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400 text-sm">⏳ Loading chart data...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400 text-sm">No price data found for {selectedCrop}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`₹${value}`, selectedCrop]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ fill: '#16a34a', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {/* Predicted label */}
          {chartData.length > 0 && (
            <div className="mt-4 bg-orange-50 rounded-xl p-3">
              <p className="text-orange-600 text-sm font-medium">
                📊 Latest recorded price:{' '}
                <strong>₹{latestPrice}/unit</strong>
                {trend && (
                  <span className={`ml-2 ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    ({trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% over 6 months)
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DemandChart;