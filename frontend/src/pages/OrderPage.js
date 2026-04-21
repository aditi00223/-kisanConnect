import React, { useState } from 'react';

const API = 'http://localhost:5000';

const statusMeta = {
  placed:    { label: 'Placed',    bg: '#faeeda', color: '#854f0b', border: '#fac775' },
  confirmed: { label: 'Confirmed', bg: '#e6f1fb', color: '#185fa5', border: '#b5d4f4' },
  pickedup:  { label: 'Picked Up', bg: '#eaf3de', color: '#3B6D11', border: '#c0dd97' },
  cancelled: { label: 'Cancelled', bg: '#faece7', color: '#993c1d', border: '#f5c4b3' },
};

const OrderPage = ({ user, crop, onBack, onOrderPlaced }) => {
  const [payment, setPayment] = useState('upi');
  const [quantity, setQuantity] = useState(1);
  const [ordered, setOrdered] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const total = (crop?.pricePerUnit || crop?.price || 0) * quantity;

  const handlePlaceOrder = async () => {
    setError('');
    if (!quantity || quantity < 1) return setError('Please enter a valid quantity');
    if (quantity > crop?.quantity) return setError(`Only ${crop?.quantity} ${crop?.unit} available`);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: crop?._id || crop?.id, quantity: Number(quantity), paymentMethod: payment }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to place order'); setLoading(false); return; }
      setOrderData(data.order);
      setOrdered(true);
    } catch { setError('Cannot connect to server. Make sure backend is running.'); }
    setLoading(false);
  };

  const handleMarkPickup = async () => {
    try {
      const res = await fetch(`${API}/api/orders/${orderData._id}/pickup`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { const data = await res.json(); setOrderData(data.order); }
    } catch { setError('Failed to mark pickup'); }
  };

  const inputStyle = { border: '1px solid #d4e8b0', background: '#f9fdf4', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#27500a', outline: 'none', width: '100%', boxSizing: 'border-box' };

  // Success Screen
  if (ordered && orderData) {
    const sm = statusMeta[orderData.status] || { label: orderData.status, bg: '#f1efe8', color: '#5F5E5A', border: '#d3d1c7' };
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f7e6 0%, #fffbf2 60%, #fff4ec 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 440, padding: 36, textAlign: 'center', border: '1px solid #e2f0cc', boxShadow: '0 4px 24px #3B6D1112' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #eaf3de, #fef9ec)', border: '2px solid #c0dd97', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 16px' }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#27500a', margin: '0 0 8px' }}>Order Placed!</h2>
          <p style={{ fontSize: 13, color: '#9aab87', marginBottom: 24 }}>
            Your order for <strong style={{ color: '#27500a' }}>{crop?.name || crop?.crop}</strong> from <strong style={{ color: '#27500a' }}>{crop?.farmer?.name || crop?.farmer}</strong> has been placed successfully.
          </p>

          <div style={{ background: '#f9fdf4', border: '1px solid #e2f0cc', borderRadius: 16, padding: '16px 20px', textAlign: 'left', marginBottom: 20 }}>
            {[
              { icon: '📦', label: 'Crop', val: crop?.name || crop?.crop },
              { icon: '🧑‍🌾', label: 'Farmer', val: crop?.farmer?.name || crop?.farmer },
              { icon: '📍', label: 'Location', val: crop?.location },
              { icon: '📦', label: 'Quantity', val: `${orderData.quantity} ${crop?.unit}` },
              { icon: '💰', label: 'Total', val: `₹${orderData.totalPrice}` },
              { icon: '💳', label: 'Payment', val: payment === 'upi' ? 'UPI' : 'Cash on Pickup' },
            ].map(({ icon, label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f0f7e6' }}>
                <span style={{ fontSize: 12, color: '#9aab87' }}>{icon} {label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#27500a' }}>{val}</span>
              </div>
            ))}
            <div style={{ paddingTop: 10, textAlign: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}>
                {sm.label}
              </span>
            </div>
          </div>

          {orderData.status === 'confirmed' && (
            <button onClick={handleMarkPickup}
              style={{ width: '100%', marginBottom: 10, padding: '13px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#fff', background: 'linear-gradient(135deg, #3B6D11, #639922)', boxShadow: '0 4px 14px #3B6D1140' }}>
              ✅ Mark as Picked Up
            </button>
          )}
          <button onClick={onBack}
            style={{ width: '100%', padding: '13px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#fff', background: 'linear-gradient(135deg, #d97706, #f59e0b)', boxShadow: '0 4px 14px #d9770640' }}>
            🛒 Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

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
      <div style={{ background: 'linear-gradient(135deg, #27500a 0%, #3B6D11 50%, #639922 100%)', padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 80% 50%, #f59e0b, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Place Order 📦</h1>
          <p style={{ color: '#c0dd97', fontSize: 13, marginTop: 4 }}>Review and confirm your order</p>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>

        {error && (
          <div style={{ background: '#faece7', border: '1px solid #f5c4b3', color: '#993c1d', fontSize: 13, borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Crop Summary */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, border: '1px solid #e2f0cc', boxShadow: '0 2px 12px #3B6D1108' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eaf3de', border: '1px solid #c0dd97', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🌾</div>
            <div>
              <h3 style={{ fontWeight: 700, color: '#27500a', fontSize: 16, margin: 0 }}>{crop?.name || crop?.crop}</h3>
              <p style={{ fontSize: 12, color: '#9aab87', margin: 0 }}>🧑‍🌾 {crop?.farmer?.name || crop?.farmer}</p>
            </div>
          </div>
          <div style={{ paddingTop: 14, borderTop: '1px solid #f0f7e6' }}>
            {[
              { icon: '📍', val: crop?.location },
              { icon: '📦', val: `Available: ${crop?.quantity} ${crop?.unit}` },
            ].map(({ icon, val }) => (
              <p key={icon} style={{ fontSize: 12, color: '#5F5E5A', margin: '4px 0' }}>{icon} {val}</p>
            ))}
            <p style={{ fontWeight: 700, fontSize: 18, color: '#3B6D11', margin: '10px 0 0' }}>
              ₹{crop?.pricePerUnit || crop?.price}<span style={{ fontSize: 12, fontWeight: 400, color: '#9aab87' }}>/{crop?.unit || 'quintal'}</span>
            </p>
          </div>
        </div>

        {/* Quantity */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, border: '1px solid #e2f0cc', boxShadow: '0 2px 12px #3B6D1108' }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#27500a', display: 'block', marginBottom: 10 }}>
            Quantity ({crop?.unit || 'quintal'})
          </label>
          <input type="number" min="1" max={crop?.quantity} value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))} style={inputStyle} />
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12, background: '#eaf3de', border: '1px solid #c0dd97', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#3B6D11' }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#3B6D11' }}>₹{total}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, border: '1px solid #e2f0cc', boxShadow: '0 2px 12px #3B6D1108' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#27500a', margin: '0 0 12px' }}>Payment Method</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { key: 'upi',  label: '📱 UPI Payment',     desc: 'Pay online instantly' },
              { key: 'cash', label: '💵 Cash on Pickup',  desc: 'Pay at the farm' },
            ].map((p) => (
              <button key={p.key} onClick={() => setPayment(p.key)}
                style={{ flex: 1, padding: '12px 10px', borderRadius: 14, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                  border: payment === p.key ? '2px solid #3B6D11' : '1px solid #e2f0cc',
                  background: payment === p.key ? '#eaf3de' : '#f9fdf4' }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#27500a', margin: 0 }}>{p.label}</p>
                <p style={{ fontSize: 11, color: '#9aab87', marginTop: 4 }}>{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Place Order */}
        <button onClick={handlePlaceOrder} disabled={loading}
          style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 15, color: '#fff',
            background: loading ? '#9aab87' : 'linear-gradient(135deg, #d97706, #f59e0b)',
            boxShadow: loading ? 'none' : '0 4px 16px #d9770645' }}>
          {loading ? '⏳ Placing Order...' : `✅ Confirm Order — ₹${total}`}
        </button>
      </div>
    </div>
  );
};

export default OrderPage;