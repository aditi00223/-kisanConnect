import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const API = 'http://localhost:5000';

const AuthPage = ({ onLogin }) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('farmer');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password) return setError('Please fill email and password');
    if (!isLogin && !form.name) return setError('Please enter your name');

    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role, phone: form.phone, location: form.location };

      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Something went wrong'); setLoading(false); return; }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch {
      setError('Cannot connect to server. Make sure backend is running on port 5000.');
    }
    setLoading(false);
  };

  const inputClass = `
    w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
    border border-[#d4e8b0] bg-[#f9fdf4]
    focus:border-[#639922] focus:bg-white focus:ring-2 focus:ring-[#639922]/10
    placeholder:text-[#9aab87] text-[#27500a]
  `;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(145deg, #f0f7e6 0%, #fff8ec 50%, #fff0e0 100%)' }}>

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #97c459, transparent)', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', transform: 'translate(30%, 30%)' }} />

      <div className="relative w-full max-w-md">

        {/* Top accent bar */}
        <div className="h-1.5 rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg, #3B6D11, #97c459 40%, #f59e0b 70%, #e05a20)' }} />

        {/* Card */}
        <div className="bg-white rounded-b-2xl shadow-xl border border-t-0 border-[#e2f0cc] px-8 py-8">

          {/* Logo */}
          <div className="text-center mb-7">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-[#c0dd97]"
              style={{ background: 'linear-gradient(135deg, #eaf3de, #fef9ec)' }}>
              <span className="text-3xl">🌾</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#27500a' }}>KisanConnect</h1>
            <p className="text-xs font-medium mt-1 tracking-wide uppercase" style={{ color: '#e05a20' }}>
              Seedha Kisan · Seedha Daam
            </p>
          </div>

          {/* Login / Register tabs */}
          <div className="flex rounded-xl overflow-hidden border border-[#e2f0cc] mb-5 p-1 gap-1"
            style={{ background: '#f6faf0' }}>
            {[true, false].map((val) => (
              <button key={String(val)} onClick={() => { setIsLogin(val); setError(''); }}
                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                style={isLogin === val
                  ? { background: 'linear-gradient(135deg, #3B6D11, #639922)', color: '#fff', boxShadow: '0 2px 8px #3B6D1130' }
                  : { background: 'transparent', color: '#5F5E5A' }}>
                {val ? t('login') : t('register')}
              </button>
            ))}
          </div>

          {/* Role Toggle — register only */}
          {!isLogin && (
            <div className="flex rounded-xl overflow-hidden border border-[#fde9c8] mb-5 p-1 gap-1"
              style={{ background: '#fffbf4' }}>
              {['farmer', 'buyer'].map((r) => (
                <button key={r} onClick={() => setRole(r)}
                  className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                  style={role === r
                    ? { background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: '#fff', boxShadow: '0 2px 8px #d9770630' }
                    : { background: 'transparent', color: '#85490B' }}>
                  {r === 'farmer' ? '🧑‍🌾 Farmer' : '🛒 Buyer'}
                </button>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-sm rounded-xl px-4 py-3 mb-4 border flex items-start gap-2"
              style={{ background: '#fff4f0', borderColor: '#f5c4b3', color: '#993c1d' }}>
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form fields */}
          <div className="flex flex-col gap-3">
            {!isLogin && (
              <input type="text" placeholder="Full Name" className={inputClass}
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            )}
            <input type="email" placeholder="Email Address" className={inputClass}
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Password" className={inputClass}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {!isLogin && (
              <>
                <input type="text" placeholder="Phone Number" className={inputClass}
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input type="text" placeholder="Location (e.g. Ludhiana, Punjab)" className={inputClass}
                  value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </>
            )}

            {/* Submit button */}
            <button onClick={handleSubmit} disabled={loading}
              className="mt-1 w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-50"
              style={{
                background: loading
                  ? '#9aab87'
                  : isLogin
                  ? 'linear-gradient(135deg, #3B6D11, #639922)'
                  : 'linear-gradient(135deg, #d97706, #f59e0b)',
                boxShadow: loading ? 'none' : isLogin ? '0 4px 14px #3B6D1140' : '0 4px 14px #d9770640',
              }}>
              {loading
                ? '⏳ Please wait...'
                : isLogin
                ? `🔐 ${t('login')}`
                : `✅ ${t('register')} as ${role === 'farmer' ? '🧑‍🌾 Farmer' : '🛒 Buyer'}`}
            </button>
          </div>

          {/* Divider hint */}
          <p className="text-center text-xs mt-5" style={{ color: '#9aab87' }}>
            {isLogin ? "Don't have an account? " : 'Already registered? '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="font-semibold underline underline-offset-2"
              style={{ color: isLogin ? '#d97706' : '#3B6D11', background: 'none', border: 'none', cursor: 'pointer' }}>
              {isLogin ? t('register') : t('login')}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default AuthPa