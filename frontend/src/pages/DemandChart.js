import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const API = 'http://localhost:5000';

const cropMeta = {
  Wheat:   { icon: '🌾', color: '#d97706', light: '#faeeda', border: '#fac775', stroke: '#d97706', fill: '#faeeda' },
  Rice:    { icon: '🍚', color: '#185fa5', light: '#e6f1fb', border: '#b5d4f4', stroke: '#185fa5', fill: '#e6f1fb' },
  Maize:   { icon: '🌽', color: '#854f0b', light: '#fff4e0', border: '#fac775', stroke: '#ef9f27', fill: '#fff4e0' },
  Mustard: { icon: '🌻', color: '#3B6D11', light: '#eaf3de', border: '#c0dd97', stroke: '#639922', fill: '#eaf3de' },
};

const CustomTooltip = ({ active, payload, label, crop }) => {
  if (!active || !payload?.length) return null;
  const meta = cropMeta[crop];
  return (
    <div style={{
      background: '#fff', border: `1px solid ${meta.border}`,
      borderRadius: 12, padding: '10px 16px', boxShadow: '0 4px 16px #0001'
    }}>
      <p style={{ fontSize: 11, color: '#9aab87', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 700, color: meta.color }}>₹{payload[0].value}</p>
      <p style={{ fontSize: 11, color: '#9aab87' }}>per unit</p>
    </div>
  );
};

const DemandChart = ({ onBack }) => {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const crops = ['Wheat', 'Rice', 'Maize', 'Mustard'];

  useEffect(() => { fetchPrices(); }, [selectedCrop]);

  const fetchPrices = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/prices?crop=${selectedCrop}`);
      const data = await res.json();
      if (!res.ok) { setError('Failed to load price data'); setLoading(false); return; }
      const formatted = data.prices.map((p) => ({
        month: new Date(p.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
        price: p.price,
      }));
      setChartData(formatted);
    } catch { setError('Cannot connect to server.'); }
    setLoading(false);
  };

  const latestPrice = chartData[chartData.length - 1]?.price;
  const firstPrice = chartData[0]?.price;
  const trend = latestPrice && firstPrice
    ? (((latestPrice - firstPrice) / firstPrice) * 100).toFixed(1)
    : null;
  const trendUp = trend >= 0;
  const meta = cropMeta[selectedCrop];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #f0f7e6 0%, #fffbf2 60%, #fff4ec 100%)' }}>

      {/* Navbar */}
      <nav className="bg-white border-b border-[#e2f0cc] px-6 py-3 flex justify-between items-center sticky top-0 z-10"
        style={{ boxShadow: '0 2px 12px #3B6D1110' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, #eaf3de, #fef9ec)', border: '1px solid #c0dd97' }}>🌾</div>
          <span className="text-lg font-bold" style={{ color: '#27500a' }}>KisanConnect</span>
        </div>
        <button onClick={onBack}
          className="text-xs font-semibold px-4 py-1.5 rounded-lg border transition-all"
          style={{ background: '#f0f7e6', borderColor: '#c0dd97', color: '#3B6D11' }}>
          ← Back
        </button>
      </nav>

      {/* Hero */}
      <div className="px-6 py-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #27500a 0%, #3B6D11 50%, #639922 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #f59e0b 0%, transparent 60%)' }} />
        <div className="max-w-4xl mx-auto relative">
          <h1 className="text-2xl font-bold text-white">Demand Forecasting</h1>
          <p className="text-sm mt-1" style={{ color: '#c0dd97' }}>Real crop price trends from database</p>
        </div>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">

        {/* Crop selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {crops.map((crop) => {
            const m = cropMeta[crop];
            const active = selectedCrop === crop;
            return (
              <button key={crop} onClick={() => setSelectedCrop(crop)}
                className="px-4 py-2 rounded-full text-sm font-bold border transition-all flex items-center gap-1.5"
                style={active
                  ? { background: m.color, color: '#fff', borderColor: m.color, boxShadow: `0 2px 10px ${m.color}50` }
                  : { background: m.light, color: m.color, borderColor: m.border }}>
                {m.icon} {crop}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="text-sm rounded-xl px-4 py-3 mb-4 border flex gap-2"
            style={{ background: '#faece7', borderColor: '#f5c4b3', color: '#993c1d' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Stat cards */}
        {!loading && chartData.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {
                label: 'Current Price',
                value: `₹${latestPrice}`,
                sub: 'per unit',
                color: meta.color,
                bg: meta.light,
                border: meta.border,
              },
              {
                label: '6-Month Trend',
                value: `${trendUp ? '▲' : '▼'} ${Math.abs(trend)}%`,
                sub: trendUp ? 'Price rising' : 'Price falling',
                color: trendUp ? '#3B6D11' : '#993c1d',
                bg: trendUp ? '#eaf3de' : '#faece7',
                border: trendUp ? '#c0dd97' : '#f5c4b3',
              },
              {
                label: 'Data Points',
                value: chartData.length,
                sub: 'months tracked',
                color: '#854f0b',
                bg: '#faeeda',
                border: '#fac775',
              },
            ].map(({ label, value, sub, color, bg, border }) => (
              <div key={label} className="rounded-2xl p-4 text-center transition-all"
                style={{ background: bg, border: `1px solid ${border}` }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#9aab87' }}>{label}</p>
                <p className="text-xl font-bold" style={{ color }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9aab87' }}>{sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Chart card */}
        <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e2f0cc', boxShadow: '0 2px 16px #3B6D1108' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold" style={{ color: '#27500a' }}>
                {meta.icon} {selectedCrop} — Price Trend
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#9aab87' }}>₹ per unit · last {chartData.length} months</p>
            </div>
            {trend && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={trendUp
                  ? { background: '#eaf3de', color: '#3B6D11', border: '1px solid #c0dd97' }
                  : { background: '#faece7', color: '#993c1d', border: '1px solid #f5c4b3' }}>
                {trendUp ? '▲' : '▼'} {Math.abs(trend)}%
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="text-3xl animate-pulse">{meta.icon}</div>
              <p className="text-sm" style={{ color: '#9aab87' }}>Loading chart data...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-2">
              <p className="text-3xl">📊</p>
              <p className="font-semibold" style={{ color: '#3B6D11' }}>No data found</p>
              <p className="text-sm" style={{ color: '#9aab87' }}>No price data available for {selectedCrop}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={meta.stroke} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={meta.stroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9aab87' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9aab87' }} axisLine={false} tickLine={false} width={45} />
                <Tooltip content={<CustomTooltip crop={selectedCrop} />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={meta.stroke}
                  strokeWidth={2.5}
                  fill="url(#priceGrad)"
                  dot={{ fill: meta.stroke, r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, stroke: meta.stroke, strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* Bottom insight bar */}
          {chartData.length > 0 && (
            <div className="mt-4 rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background: meta.light, border: `1px solid ${meta.border}` }}>
              <p className="text-sm font-semibold" style={{ color: meta.color }}>
                📊 Latest: <strong>₹{latestPrice}/unit</strong>
              </p>
              {trend && (
                <p className="text-xs font-semibold" style={{ color: trendUp ? '#3B6D11' : '#993c1d' }}>
                  {trendUp ? '▲' : '▼'} {Math.abs(trend)}% over {chartData.length} months
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemandChart;