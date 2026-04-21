import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

const categoryMeta = {
  All:       { icon: '🌿', color: '#3B6D11', bg: '#eaf3de', border: '#c0dd97' },
  Grain:     { icon: '🌾', color: '#854f0b', bg: '#faeeda', border: '#fac775' },
  Vegetable: { icon: '🥦', color: '#0f6e56', bg: '#e1f5ee', border: '#9fe1cb' },
  Fruit:     { icon: '🍎', color: '#993c1d', bg: '#faece7', border: '#f5c4b3' },
  Rice:      { icon: '🍚', color: '#185fa5', bg: '#e6f1fb', border: '#b5d4f4' },
};

const BuyerMarketplace = ({ user, onLogout, onOrder, onViewChart, onViewForum }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchProducts(); }, [category]);

  const fetchProducts = async () => {
    setLoading(true); setError('');
    try {
      let url = `${API}/api/products`;
      if (category !== 'All') url += `?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch { setError('Failed to load products. Make sure backend is running.'); }
    setLoading(false);
  };

  const categories = ['All', 'Grain', 'Vegetable', 'Fruit', 'Rice'];

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.farmer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const cheapest = {};
  products.forEach((p) => {
    if (!cheapest[p.name] || p.pricePerUnit < cheapest[p.name]) cheapest[p.name] = p.pricePerUnit;
  });

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
        <div className="flex items-center gap-2">
          <button onClick={onViewForum}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
            style={{ background: '#fffbf4', borderColor: '#fac775', color: '#854f0b' }}>
            💬 Forum
          </button>
          <button onClick={onViewChart}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
            style={{ background: '#f0f7e6', borderColor: '#c0dd97', color: '#3B6D11' }}>
            📈 Price Trends
          </button>
          <span className="text-xs font-medium px-3 py-1.5 rounded-lg hidden sm:block"
            style={{ background: '#eaf3de', color: '#3B6D11' }}>
            🛒 {user?.name}
          </span>
          <button
            onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); onLogout(); }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
            style={{ background: '#faece7', borderColor: '#f5c4b3', color: '#993c1d' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Hero header */}
      <div className="px-6 py-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #27500a 0%, #3B6D11 50%, #639922 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #f59e0b 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto relative">
          <h1 className="text-2xl font-bold text-white">Buyer Marketplace</h1>
          <p className="text-sm mt-1" style={{ color: '#c0dd97' }}>Compare prices directly from farmers — no middlemen</p>
          <div className="flex gap-4 mt-4">
            {[
              { label: 'Live Listings', val: products.length },
              { label: 'Categories', val: categories.length - 1 },
              { label: 'Available', val: products.filter(p => p.isAvailable).length },
            ].map(({ label, val }) => (
              <div key={label} className="px-4 py-2 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <p className="text-white font-bold text-lg leading-none">{val}</p>
                <p className="text-xs mt-0.5" style={{ color: '#c0dd97' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="px-6 py-4 bg-white border-b border-[#e2f0cc]">
        <div className="max-w-5xl mx-auto">
          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9aab87' }}>🔍</span>
            <input
              type="text"
              placeholder="Search crop, farmer or location..."
              className="w-full rounded-xl px-4 py-3 pl-10 text-sm outline-none transition-all"
              style={{
                border: '1px solid #d4e8b0', background: '#f9fdf4',
                color: '#27500a'
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => {
              const meta = categoryMeta[cat];
              const active = category === cat;
              return (
                <button key={cat} onClick={() => setCategory(cat)}
                  className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all"
                  style={active
                    ? { background: meta.color, color: '#fff', borderColor: meta.color, boxShadow: `0 2px 8px ${meta.color}40` }
                    : { background: meta.bg, color: meta.color, borderColor: meta.border }}>
                  {meta.icon} {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="px-6 py-6 max-w-5xl mx-auto">

        {error && (
          <div className="text-sm rounded-xl px-4 py-3 mb-4 border flex gap-2"
            style={{ background: '#faece7', borderColor: '#f5c4b3', color: '#993c1d' }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl animate-pulse"
              style={{ background: '#eaf3de' }}>🌾</div>
            <p className="text-sm" style={{ color: '#9aab87' }}>Loading fresh listings...</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold mb-4 px-1" style={{ color: '#9aab87' }}>
              {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold" style={{ color: '#3B6D11' }}>No crops found</p>
                <p className="text-sm mt-1" style={{ color: '#9aab87' }}>Try a different search or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => {
                  const isCheapest = item.pricePerUnit === cheapest[item.name];
                  return (
                    <div key={item._id}
                      className="bg-white rounded-2xl p-5 relative flex flex-col transition-all"
                      style={{ border: '1px solid #e2f0cc', boxShadow: '0 2px 12px #3B6D1108' }}>

                      {/* Cheapest badge */}
                      {isCheapest && (
                        <span className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full"
                          style={{ background: '#faeeda', color: '#854f0b', border: '1px solid #fac775' }}>
                          🏷️ Cheapest
                        </span>
                      )}

                      {/* Crop name */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: '#eaf3de', border: '1px solid #c0dd97' }}>🌾</div>
                        <div>
                          <h3 className="font-bold text-base leading-tight" style={{ color: '#27500a' }}>{item.name}</h3>
                          <p className="text-xs" style={{ color: '#9aab87' }}>{item.farmer?.name || 'Farmer'}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex flex-col gap-1 mb-3">
                        {[
                          { icon: '📍', val: item.location },
                          { icon: '📦', val: `${item.quantity} ${item.unit}` },
                          { icon: '⭐', val: item.farmer?.rating?.toFixed(1) || '—' },
                        ].map(({ icon, val }) => (
                          <p key={icon} className="text-xs flex items-center gap-1.5" style={{ color: '#5F5E5A' }}>
                            <span>{icon}</span> {val}
                          </p>
                        ))}
                      </div>

                      {/* Price + availability */}
                      <div className="flex justify-between items-center mt-auto mb-3 pt-3"
                        style={{ borderTop: '1px solid #e2f0cc' }}>
                        <p className="font-bold text-xl" style={{ color: '#3B6D11' }}>
                          ₹{item.pricePerUnit}
                          <span className="text-xs font-normal ml-1" style={{ color: '#9aab87' }}>/{item.unit}</span>
                        </p>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={item.isAvailable
                            ? { background: '#eaf3de', color: '#3B6D11', border: '1px solid #c0dd97' }
                            : { background: '#faece7', color: '#993c1d', border: '1px solid #f5c4b3' }}>
                          {item.isAvailable ? '● Available' : '● Sold Out'}
                        </span>
                      </div>

                      <button
                        onClick={() => onOrder(item)}
                        disabled={!item.isAvailable}
                        className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                        style={item.isAvailable
                          ? { background: 'linear-gradient(135deg, #d97706, #f59e0b)', boxShadow: '0 3px 10px #d9770635' }
                          : { background: '#e2e0dc', color: '#9aab87', cursor: 'not-allowed' }}>
                        {item.isAvailable ? '🛒 Place Order' : 'Sold Out'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuyerMarketplace;