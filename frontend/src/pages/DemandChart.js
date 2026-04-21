import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../api';

const DemandChart = ({ cropName = 'Wheat', onBack }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(cropName);
  const [loading, setLoading] = useState(true);

  const crops = ['Wheat', 'Tomato', 'Rice'];

  useEffect(() => {
    const fetchPriceHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/prices/history?crop=${selectedCrop}`);
        setChartData(res.data);
      } catch (err) {
        console.error('Failed to fetch price history:', err);
        // Fallback data if API not ready
        setChartData([
          { month: 'Oct', price: 1900 },
          { month: 'Nov', price: 2000 },
          { month: 'Dec', price: 2100 },
          { month: 'Jan', price: 2050 },
          { month: 'Feb', price: 2200 },
          { month: 'Mar', price: 2300 },
          { month: 'Apr (Predicted)', price: 2400 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPriceHistory();
  }, [selectedCrop]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">Demand Forecasting</h1>
          {onBack && (
            <button onClick={onBack} className="text-sm text-green-600 border border-green-600 px-3 py-1 rounded-lg">
              Back
            </button>
          )}
        </div>
        <div className="flex gap-2 mb-6">
          {crops.map(crop => (
            <button key={crop} onClick={() => setSelectedCrop(crop)}
              className={`px-4 py-1 rounded-full text-sm ${selectedCrop === crop ? 'bg-green-600 text-white' : 'bg-white border'}`}>
              {crop}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {selectedCrop} Price Trend (₹/quintal)
          </h2>
          {loading ? <p className="text-center py-10">Loading chart...</p> : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#16a34a"
                  strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
          {chartData.length > 0 && (
            <p className="text-sm text-green-600 mt-3 font-medium">
              Predicted next month: ₹{chartData[chartData.length - 1]?.price}/quintal
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemandChart;