import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

const WalletPage = ({ user, onBack }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/wallet`, { headers: authHeader });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      setWallet(data.wallet);
    } catch {
      setError('Cannot connect to server.');
    }
    setLoading(false);
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const totalCredits = wallet?.transactions
    ?.filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const totalDebits = wallet?.transactions
    ?.filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0) || 0;

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
        <h1 className="text-2xl font-bold">My Wallet 💰</h1>
        <p className="text-green-200 text-sm mt-1">Track your earnings and transactions</p>
      </div>

      <div className="px-6 py-6 max-w-2xl mx-auto">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400 text-sm py-8">⏳ Loading wallet...</p>
        ) : !wallet ? (
          <p className="text-center text-gray-400 text-sm py-8">No wallet found.</p>
        ) : (
          <>
            {/* Balance Card */}
            <div className="bg-green-700 text-white rounded-2xl shadow p-6 mb-6">
              <p className="text-green-200 text-sm">Available Balance</p>
              <p className="text-4xl font-bold mt-1">₹{wallet.balance.toLocaleString()}</p>
              <p className="text-green-300 text-xs mt-3">
                Payments released after buyer pickup confirmation
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl shadow p-5 text-center border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Total Received</p>
                <p className="text-2xl font-bold text-green-700">₹{totalCredits.toLocaleString()}</p>
                <p className="text-xs text-green-500 mt-1">📈 Credits</p>
              </div>
              <div className="bg-white rounded-2xl shadow p-5 text-center border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-orange-600">{wallet.transactions?.length || 0}</p>
                <p className="text-xs text-gray-400 mt-1">📋 All time</p>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-orange-50 rounded-2xl p-4 mb-6 border border-orange-100">
              <h3 className="text-sm font-bold text-orange-700 mb-2">💡 How payments work</h3>
              <div className="flex flex-col gap-2">
                {[
                  { step: '1', text: 'Buyer places order and pays via UPI — amount is held' },
                  { step: '2', text: 'Farmer confirms the order' },
                  { step: '3', text: 'Buyer picks up crop from farm' },
                  { step: '4', text: 'Payment is released to your wallet instantly ✅' },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <p className="text-xs text-orange-700">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-green-700 mb-4">Transaction History</h2>

              {wallet.transactions?.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No transactions yet. Complete an order to receive payment!
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {[...wallet.transactions].reverse().map((txn, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${
                          txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {txn.type === 'credit' ? '📥' : '📤'}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{txn.description}</p>
                          <p className="text-xs text-gray-400">{timeAgo(txn.date)}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${
                        txn.type === 'credit' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletPage;