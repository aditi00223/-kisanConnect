import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerMarketplace from './pages/BuyerMarketplace';
import OrderPage from './pages/OrderPage';
import DemandChart from './pages/DemandChart';
import FarmerProfile from './pages/FarmerProfile';
import ForumPage from './pages/ForumPage';
import WalletPage from './pages/WalletPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      const parsedUser = JSON.parse(savedUser);
      login(parsedUser);
      if (parsedUser.role === 'farmer') {
        navigate('/farmer');
      } else {
        navigate('/buyer');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.role === 'farmer') {
      setPage('farmerDashboard');
    } else {
      setPage('buyerMarketplace');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onGetStarted={() => navigate('/auth')} />} />
      <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />

      <Route path="/farmer" element={
        <ProtectedRoute user={user}>
          <FarmerDashboard
            user={user}
            onLogout={handleLogout}
            onViewProfile={() => navigate('/farmer/profile')}
            onViewWallet={() => navigate('/farmer/wallet')}
            onViewForum={() => navigate('/forum')}
          />
        </ProtectedRoute>
      } />
      <Route path="/farmer/profile" element={
        <ProtectedRoute user={user}>
          <FarmerProfile user={user} onBack={() => navigate('/farmer')} />
        </ProtectedRoute>
      } />
      <Route path="/farmer/wallet" element={
        <ProtectedRoute user={user}>
          <WalletPage user={user} onBack={() => navigate('/farmer')} />
        </ProtectedRoute>
      } />

      <Route path="/buyer" element={
        <ProtectedRoute user={user}>
          <BuyerMarketplace
            user={user}
            onLogout={handleLogout}
            onOrder={(crop) => { setSelectedCrop(crop); navigate('/order'); }}
            onViewChart={() => navigate('/chart')}
            onViewForum={() => navigate('/forum')}
          />
        </ProtectedRoute>
      } />
      <Route path="/order" element={
        <ProtectedRoute user={user}>
          <OrderPage
            user={user}
            crop={selectedCrop}
            onBack={() => navigate('/buyer')}
            onOrderPlaced={() => navigate('/buyer')}
          />
        </ProtectedRoute>
      } />
      <Route path="/chart" element={
        <ProtectedRoute user={user}>
          <DemandChart onBack={() => navigate('/buyer')} />
        </ProtectedRoute>
      } />
      <Route path="/forum" element={
        <ProtectedRoute user={user}>
          <ForumPage
            user={user}
            onBack={() => user?.role === 'farmer' ? navigate('/farmer') : navigate('/buyer')}
          />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;