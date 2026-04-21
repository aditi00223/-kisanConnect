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

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Save token and user to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLogin(data.user);
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running on port 5000.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-4xl">🌾</span>
          <h1 className="text-2xl font-bold text-green-700 mt-1">KisanConnect</h1>
          <p className="text-orange-500 text-sm">Seedha Kisan, Seedha Daam</p>
        </div>

        {/* Role Toggle — only on Register */}
        {!isLogin && (
          <div className="flex rounded-xl overflow-hidden border border-green-200 mb-6">
            {['farmer', 'buyer'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-3 font-semibold text-sm transition-all ${
                  role === r ? 'bg-green-600 text-white' : 'bg-white text-green-700'
                }`}
              >
                {r === 'farmer' ? '🧑‍🌾 Farmer' : '🛒 Buyer'}
              </button>
            ))}
          </div>
        )}

        {/* Login/Register Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              onClick={() => { setIsLogin(val); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-all ${
                isLogin === val ? 'bg-orange-500 text-white' : 'bg-white text-gray-500'
              }`}
            >
              {val ? t('login') : t('register')}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Phone Number"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location (e.g. Ludhiana, Punjab)"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-3 rounded-xl text-sm"
          >
            {loading
              ? '⏳ Please wait...'
              : isLogin
              ? `🔐 ${t('login')}`
              : `✅ ${t('register')} as ${role === 'farmer' ? '🧑‍🌾 Farmer' : '🛒 Buyer'}`}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;