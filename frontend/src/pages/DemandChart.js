import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = {
  Wheat: [
    { month: 'Oct', price: 1900 },
    { month: 'Nov', price: 2000 },
    { month: 'Dec', price: 2100 },
    { month: 'Jan', price: 2050 },
    { month: 'Feb', price: 2200 },
    { month: 'Mar', price: 2300 },
    { month: 'Apr (Predicted)', price: 2400 },
  ],
  Tomato: [
    { month: 'Oct', price: 600 },
    { month: 'Nov', price: 700 },
    { month: 'Dec', price: 900 },
    { month: 'Jan', price: 850 },
    { month: 'Feb', price: 780 },
    { month: 'Mar', price: 800 },
    { month: 'Apr (Predicted)', price: 750 },
  ],
  Rice: [
    { month: 'Oct', price: 2800 },
    { month: 'Nov', price: 2900 },
    { month: 'Dec', price: 3000 },
    { month: 'Jan', price: 3100 },
    { month: 'Feb', price: 3050 },
    { month: 'Mar', price: 3200 },
    { month: 'Apr (Predicted)', price: 3300 },
  ],
};

const DemandChart = ({ onBack }) => {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');

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
        <p className="text-green-200 text-sm mt-1">Crop price trends over 6 months</p>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">

        {/* Crop Selector */}
        <div className="flex gap-3 mb-6">
          {['Wheat', 'Tomato', 'Rice'].map((crop) => (
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

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-green-700 mb-4">
            {selectedCrop} Price Trend (₹/Quintal)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data[selectedCrop]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`₹${value}/q`, selectedCrop]}
              />
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

          {/* Predicted label */}
          <div className="mt-4 bg-orange-50 rounded-xl p-3">
            <p className="text-orange-600 text-sm font-medium">
              📊 Predicted price for next month:{' '}
              <strong>₹{data[selectedCrop][data[selectedCrop].length - 1].price}/quintal</strong>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DemandChart;