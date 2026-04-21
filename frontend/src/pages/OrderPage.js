import React, { useState } from 'react';

const API = 'http://localhost:5000';

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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: crop?._id || crop?.id,
          quantity: Number(quantity),
          paymentMethod: payment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to place order');
        setLoading(false);
        return;
      }

      setOrderData(data.order);
      setOrdered(true);
    } catch {
      setError('Cannot connect to server. Make sure backend is running.');
    }
    setLoading(false);
  };

  // Mark as picked up
  const handleMarkPickup = async () => {
    try {
      const res = await fetch(`${API}/api/orders/${orderData._id}/pickup`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrderData(data.order);
      }
    } catch {
      setError('Failed to mark pickup');
    }
  };

  if (ordered && orderData) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Order Placed!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your order for <strong>{crop?.name || crop?.crop}</strong> from{' '}
            <strong>{crop?.farmer?.name || crop?.farmer}</strong> has been placed successfully.
          </p>
          <div className="bg-green-50 rounded-xl p-4 text-left mb-6">
            <p className="text-sm text-gray-600">📦 Crop: <strong>{crop?.name || crop?.crop}</strong></p>
            <p className="text-sm text-gray-600">👨‍🌾 Farmer: <strong>{crop?.farmer?.name || crop?.farmer}</strong></p>
            <p className="text-sm text-gray-600">📍 Location: <strong>{crop?.location}</strong></p>
            <p className="text-sm text-gray-600">📦 Quantity: <strong>{orderData.quantity} {crop?.unit}</strong></p>
            <p className="text-sm text-gray-600">💰 Total: <strong>₹{orderData.totalPrice}</strong></p>
            <p className="text-sm text-gray-600">💳 Payment: <strong>{payment === 'upi' ? 'UPI' : 'Cash on Pickup'}</strong></p>
            <p className="text-sm mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                orderData.status === 'placed' ? 'bg-yellow-100 text-yellow-700' :
                orderData.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                orderData.status === 'pickedup' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                Status: {orderData.status}
              </span>
            </p>
          </div>

          {/* Mark Pickup button — only when confirmed */}
          {orderData.status === 'confirmed' && (
            <button
              onClick={handleMarkPickup}
              className="w-full mb-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm"
            >
              ✅ Mark as Picked Up
            </button>
          )}

          <button
            onClick={onBack}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm"
          >
            🛒 Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

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

      <div className="px-6 py-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Place Order 📦</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Crop Summary */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6 border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">🌾 {crop?.name || crop?.crop}</h3>
          <p className="text-sm text-gray-500 mt-1">👨‍🌾 {crop?.farmer?.name || crop?.farmer}</p>
          <p className="text-sm text-gray-500">📍 {crop?.location}</p>
          <p className="text-sm text-gray-500">📦 Available: {crop?.quantity} {crop?.unit}</p>
          <p className="text-green-600 font-bold text-lg mt-2">
            ₹{crop?.pricePerUnit || crop?.price}/{crop?.unit || 'quintal'}
          </p>
        </div>

        {/* Quantity */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6 border border-gray-100">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Quantity ({crop?.unit || 'quintal'})
          </label>
          <input
            type="number"
            min="1"
            max={crop?.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
          />
          <p className="text-green-600 font-bold mt-3 text-lg">
            Total: ₹{total}
          </p>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">Payment Method</p>
          <div className="flex gap-3">
            {[
              { key: 'upi', label: '📱 UPI Payment', desc: 'Pay online instantly' },
              { key: 'cash', label: '💵 Cash on Pickup', desc: 'Pay at the farm' },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPayment(p.key)}
                className={`flex-1 p-3 rounded-xl border-2 text-left transition-all ${
                  payment === p.key ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                }`}
              >
                <p className="font-medium text-sm">{p.label}</p>
                <p className="text-xs text-gray-400 mt-1">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-xl text-lg"
        >
          {loading ? '⏳ Placing Order...' : `✅ Confirm Order — ₹${total}`}
        </button>
      </div>
    </div>
  );
};

export default OrderPage;