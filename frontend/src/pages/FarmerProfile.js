import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

const statusMeta = {
  placed:    { label: 'Placed',    bg: '#faeeda', color: '#854f0b', border: '#fac775' },
  confirmed: { label: 'Confirmed', bg: '#e6f1fb', color: '#185fa5', border: '#b5d4f4' },
  pickedup:  { label: 'Picked Up', bg: '#eaf3de', color: '#3B6D11', border: '#c0dd97' },
  cancelled: { label: 'Cancelled', bg: '#faece7', color: '#993c1d', border: '#f5c4b3' },
};

const FarmerProfile = ({ user, onBack }) => {
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, walletRes] = await Promise.all([
        fetch(`${API}/api/products`, { headers: authHeader }),
        fetch(`${API}/api/orders/my`, { headers: authHeader }),
        fetch(`${API}/api/wallet`, { headers: authHeader }),
      ]);
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const walletData = await walletRes.json();

      const myListings = (productsData.products || []).filter(
        (p) => p.farmer?._id === user?.id || p.farmer === user?.id
      );
      setListings(myListings);
      setOrders(ordersData.orders || []);
      setWallet(walletData.wallet || null);
    } catch {}
    setLoading(false);
  };

  const completedOrders = orders.filter((o) => o.status === 'pickedup').length;
  const totalEarnings = wallet?.balance || 0;

  const stats = [
    { label: 'Total Listings',   value: listings.length,              icon: '📋', color: '#3B6D11', bg: '#eaf3de', border: '#c0dd97' },
    { label: 'Orders Received',  value: orders.length,                icon: '📦', color: '#854f0b', bg: '#faeeda', border: '#fac775' },
    { label: 'Total Earnings',   value: `₹${totalEarnings.toLocaleString()}`, icon: '💰', color: '#185fa5', bg: '#e6f1fb', border: '#b5d4f4' },
    { label: 'Completed Orders', value: completedOrders,              icon: '✅', color: '#3B6D11', bg: '#eaf3de', border: '#c0dd97' },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f7e6 0%, #fffbf2 60%, #fff4ec 100%)' }}>

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2f0cc', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 12px #3B6D1110' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #eaf3de, #fef9ec)', border: '1px solid #c0dd97', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌾</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#27500a' }}>KisanConnect</span>
        </div>
        <button onClick={onBack} style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 8, border: '1px solid #c0dd97', background: '#f0f7e6', color: '#3B6D11', cursor: 'pointer' }}>
          ← Back
        </button>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #27500a 0%, #3B6D11 50%, #639922 100%)', padding: '40px 24px 32px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 80% 50%, #f59e0b, transparent 60%)', pointerEvents: 'none' }} />

        {/* Avatar */}
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #d97706, #f59e0b)', border: '3px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 12px', position: 'relative' }}>
          🧑‍🌾
        </div>

        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>{user?.name || 'Farmer'}</h1>
        <p style={{ color: '#c0dd97', fontSize: 13, marginTop: 4 }}>{user?.email}</p>
        <span style={{ display: 'inline-block', marginTop: 10, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 14px', borderRadius: 999 }}>
          ✅ Verified Farmer
        </span>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🌾</div>
            <p style={{ color: '#9aab87', fontSize: 13 }}>Loading profile...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              {stats.map(({ label, value, icon, color, bg, border }) => (
                <div key={label} style={{ background: '#fff', borderRadius: 20, padding: '20px 16px', border: `1px solid ${border}`, boxShadow: '0 2px 12px #3B6D1108', textAlign: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, margin: '0 auto 10px' }}>{icon}</div>
                  <p style={{ fontWeight: 700, fontSize: 20, color, margin: 0 }}>{value}</p>
                  <p style={{ fontSize: 11, color: '#9aab87', marginTop: 4 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Wallet Card */}
            {wallet && (
              <div style={{ background: 'linear-gradient(135deg, #27500a 0%, #3B6D11 60%, #639922 100%)', borderRadius: 20, padding: '24px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -16, top: -16, width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ position: 'absolute', right: 20, bottom: -24, width: 80, height: 80, borderRadius: '50%', background: 'rgba(245,158,11,0.15)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                  <div>
                    <p style={{ color: '#c0dd97', fontSize: 12, margin: 0 }}>Wallet Balance</p>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: 30, margin: '6px 0 0' }}>₹{wallet.balance.toLocaleString()}</p>
                    <p style={{ color: '#c0dd97', fontSize: 11, marginTop: 6 }}>{wallet.transactions?.length || 0} transactions recorded</p>
                  </div>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💰</div>
                </div>
              </div>
            )}

            {/* Account Details */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, marginBottom: 20, border: '1px solid #e2f0cc', boxShadow: '0 2px 12px #3B6D1108' }}>
              <h2 style={{ color: '#27500a', fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>Account Details</h2>
              {[
                { label: 'Name',            value: user?.name || '—' },
                { label: 'Email',           value: user?.email || '—' },
                { label: 'Role',            value: 'Farmer' },
                { label: 'Active Listings', value: listings.filter(l => l.isAvailable).length },
              ].map(({ label, value }, i, arr) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < arr.length - 1 ? '1px solid #f0f7e6' : 'none' }}>
                  <span style={{ fontSize: 13, color: '#9aab87' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#27500a' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #e2f0cc', boxShadow: '0 2px 12px #3B6D1108' }}>
              <h2 style={{ color: '#27500a', fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>Recent Orders</h2>
              {recentOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <p style={{ fontSize: 28, marginBottom: 6 }}>📭</p>
                  <p style={{ fontSize: 13, color: '#9aab87' }}>No orders yet</p>
                </div>
              ) : (
                recentOrders.map((order, i) => {
                  const sm = statusMeta[order.status] || { label: order.status, bg: '#f1efe8', color: '#5F5E5A', border: '#d3d1c7' };
                  return (
                    <div key={order._id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 14, marginBottom: 14, borderBottom: i < recentOrders.length - 1 ? '1px solid #f0f7e6' : 'none' }}>
                      <div>
                        <p style={{ fontWeight: 600, color: '#27500a', fontSize: 14, margin: 0 }}>
                          🌾 {order.product?.name} — {order.quantity} {order.product?.unit}
                        </p>
                        <p style={{ fontSize: 12, color: '#9aab87', marginTop: 4 }}>👤 {order.buyer?.name || '—'} · 💳 {order.paymentMethod?.toUpperCase() || '—'}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                        <p style={{ fontWeight: 700, fontSize: 15, color: '#3B6D11', margin: 0 }}>₹{order.totalPrice}</p>
                        <span style={{ display: 'inline-block', marginTop: 5, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}>
                          {sm.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FarmerProfile;