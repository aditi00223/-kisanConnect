import React, { useState } from 'react';
import api from '../api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('farmer');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.email || !form.password) return alert('Please fill all fields');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email: form.email, password: form.password } : { ...form, role };
      const res = await api.post(endpoint, payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      alert(isLogin ? 'Login successful!' : 'Registered successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-center text-2xl font-bold text-green-700 mb-6">
          {isLogin ? 'Login' : 'Register'} — KisanConnect
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {!isLogin && (
          <input className="w-full border rounded-lg px-4 py-2 mb-3" placeholder="Full Name"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        )}
        <input className="w-full border rounded-lg px-4 py-2 mb-3" placeholder="Email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border rounded-lg px-4 py-2 mb-3" type="password" placeholder="Password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        {!isLogin && (
          <select className="w-full border rounded-lg px-4 py-2 mb-3"
            value={role} onChange={e => setRole(e.target.value)}>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
          </select>
        )}
        <button onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">
          {isLogin ? 'Login' : 'Register'}
        </button>
        <p className="text-center text-sm mt-4 text-gray-500 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;