import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AuthPage = ({ onLogin }) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('farmer');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = () => {
    if (!form.email || !form.password) return alert('Please fill all fields');
    onLogin({ ...form, role });
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

        {/* Role Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-green-200 mb-6">
          {['farmer', 'buyer'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-3 font-semibold text-sm transition-all ${
                role === r
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700'
              }`}
            >
              {r === 'farmer' ? '🧑‍🌾 Farmer' : '🛒 Buyer'}
            </button>
          ))}
        </div>

        {/* Login/Register Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              onClick={() => setIsLogin(val)}
              className={`flex-1 py-2 text-sm font-medium transition-all ${
                isLogin === val
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-500'
              }`}
            >
              {val ? t('login') : t('register')}
            </button>
          ))}
        </div>

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
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm"
          >
            {isLogin ? t('login') : t('register')} as {role === 'farmer' ? '🧑‍🌾 Farmer' : '🛒 Buyer'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;