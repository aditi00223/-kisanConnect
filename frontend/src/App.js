import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerMarketplace from './pages/BuyerMarketplace';
import OrderPage from './pages/OrderPage';
import DemandChart from './pages/DemandChart';
import FarmerProfile from './pages/FarmerProfile';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'farmer') {
      navigate('/farmer');
    } else {
      navigate('/buyer');
    }
  };

  const handleLogout = () => {
    setUser(null);
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
          />
        </ProtectedRoute>
      } />
      <Route path="/farmer/profile" element={
        <ProtectedRoute user={user}>
          <FarmerProfile user={user} onBack={() => navigate('/farmer')} />
        </ProtectedRoute>
      } />

      <Route path="/buyer" element={
        <ProtectedRoute user={user}>
          <BuyerMarketplace
            user={user}
            onLogout={handleLogout}
            onOrder={(crop) => { setSelectedCrop(crop); navigate('/order'); }}
            onViewChart={() => navigate('/chart')}
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