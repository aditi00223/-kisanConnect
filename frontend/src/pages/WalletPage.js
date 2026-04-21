import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

const WalletPage = ({ user, onBack }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchWallet(); }, []);

  const fetchWallet = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/wallet`, { headers: authHeader });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      setWallet(data.wallet);
    } catch { setError('Cannot connect to server.'); }
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

  const totalCredits = wallet?.transactions?.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0) || 0;

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
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>My Wallet 💰</h1>
          <p style={{ color: '#c0dd97', fontSize: 13, marginTop: 4 }}>Track your earnings and transactions</p>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>

        {error && (
          <div style={{ background: '#faece7', border: '1px solid #f5c4b3', color: '#993c1d', fontSize: 13, borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>💰</div>
            <p style={{ color: '#9aab87', fontSize: 13 }}>Loading wallet...</p>
          </div>
        ) : !wallet ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: 36, marginBottom: 8 }}>👛</p>
            <p style={{ color: '#9aab87', fontSize: 13 }}>No wallet found.</p>
          </div>
        ) : (
          <>
            {/* Balance Card */}
            <div style={{ background: 'linear-gradient(135deg, #27500a 0%, #3B6D11 60%, #639922 100%)', borderRadius: 20, padding: 28, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
              <div style={{ position: 'absolute', right: 24, bottom: -28, width: 90, height: 90, borderRadius: '50%', background: 'rgba(245,158,11,0.15)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <div>
                  <p style={{ color: '#c0dd97', fontSize: 12, margin: 0 }}>Available Balance</p>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 36, margin: '6px 0 0' }}>₹{wallet.balance.toLocaleString()}</p>
                  <p style={{ color: '#9fe1cb', fontSize: 11, marginTop: 8 }}>Payments released after buyer pickup confirmation</p>
                </div>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>💰</div>
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              {[
                { label: 'Total Received', value: `₹${totalCredits.toLocaleString()}`, sub: '📈 Credits', color: '#3B6D11', bg: '#eaf3de', border: '#c0dd97' },
                { label: 'Total Transactions', value: wallet.transactions?.length || 0, sub: '📋 All time', color: '#854f0b', bg: '#faeeda', border: '#fac775' },
              ].map(({ label, value, sub, color, bg, border }) => (
                <div key={label} style={{ background: '#fff', borderRadius: 20, padding: '20px 16px', textAlign: 'center', border: `1px solid ${border}`, boxShadow: '0 2px 12px #3B6D1108' }}>
                  <p style={{ fontSize: 11, color: '#9aab87', margin: '0 0 6px' }}>{label}</p>
                  <p style={{ fontWeight: 700, fontSize: 22, color, margin: 0 }}>{value}</p>
                  <p style={{ fontSize: 11, color: '#9aab87', marginTop: 4 }}>{sub}</p>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div style={{ background: '#faeeda', border: '1px solid #fac775', borderRadius: 20, padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#854f0b', margin: '0 0 14px' }}>💡 How payments work</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Buyer places order and pays via UPI — amount is held',
                  'Farmer confirms the order',
                  'Buyer picks up crop from farm',
                  'Payment is released to your wallet instantly ✅',
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#d97706', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                    <p style={{ fontSize: 12, color: '#854f0b', margin: 0, lineHeight: 1.5 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #e2f0cc', boxShadow: '0 2px 12px #3B6D1108' }}>
              <h2 style={{ color: '#27500a', fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>Transaction History</h2>
              {!wallet.transactions?.length ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <p style={{ fontSize: 28, marginBottom: 6 }}>📭</p>
                  <p style={{ fontSize: 13, color: '#9aab87' }}>No transactions yet. Complete an order to receive payment!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[...wallet.transactions].reverse().map((txn, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid #f0f7e6' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
                          background: txn.type === 'credit' ? '#eaf3de' : '#faece7',
                          border: `1px solid ${txn.type === 'credit' ? '#c0dd97' : '#f5c4b3'}` }}>
                          {txn.type === 'credit' ? '📥' : '📤'}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#27500a', margin: 0 }}>{txn.description}</p>
                          <p style={{ fontSize: 11, color: '#9aab87', margin: 0 }}>{timeAgo(txn.date)}</p>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: txn.type === 'credit' ? '#3B6D11' : '#993c1d', flexShrink: 0, marginLeft: 12 }}>
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