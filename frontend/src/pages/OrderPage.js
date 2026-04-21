import React, { useState } from 'react';

const OrderPage = ({ user, crop, onBack, onOrderPlaced }) => {
  const [payment, setPayment] = useState('upi');
  const [quantity, setQuantity] = useState(1);
  const [ordered, setOrdered] = useState(false);

  const total = crop?.price * quantity;

  const handlePlaceOrder = () => {
    if (!quantity || quantity < 1) return alert('Please enter valid quantity');
    setOrdered(true);
  };

  if (ordered) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Order Placed!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your order for <strong>{crop?.crop}</strong> from <strong>{crop?.farmer}</strong> has been placed successfully.
          </p>
          <div className="bg-green-50 rounded-xl p-4 text-left mb-6">
            <p className="text-sm text-gray-600">📦 Crop: <strong>{crop?.crop}</strong></p>
            <p className="text-sm text-gray-600">👨‍🌾 Farmer: <strong>{crop?.farmer}</strong></p>
            <p className="text-sm text-gray-600">📍 Location: <strong>{crop?.location}</strong></p>
            <p className="text-sm text-gray-600">💰 Total: <strong>₹{total}</strong></p>
            <p className="text-sm text-gray-600">💳 Payment: <strong>{payment === 'upi' ? 'UPI' : 'Cash on Pickup'}</strong></p>
            <p className="text-sm mt-2">
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                ⏳ Status: Placed
              </span>
            </p>
          </div>
          <button
            onClick={onBack}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm"
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

        {/* Crop Summary */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6 border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">🌾 {crop?.crop}</h3>
          <p className="text-sm text-gray-500 mt-1">👨‍🌾 {crop?.farmer}</p>
          <p className="text-sm text-gray-500">📍 {crop?.location}</p>
          <p className="text-green-600 font-bold text-lg mt-2">₹{crop?.price}/quintal</p>
        </div>

        {/* Quantity */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6 border border-gray-100">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Quantity (Quintal)
          </label>
          <input
            type="number"
            min="1"
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
                  payment === p.key
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
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
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg"
        >
          ✅ Confirm Order — ₹{total}
        </button>
      </div>
    </div>
  );
};

export default OrderPage;