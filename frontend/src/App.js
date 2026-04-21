import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerMarketplace from './pages/BuyerMarketplace';
import OrderPage from './pages/OrderPage';

function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'farmer') {
      setPage('farmerDashboard');
    } else {
      setPage('buyerMarketplace');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
  };

  const handleOrder = (crop) => {
    setSelectedCrop(crop);
    setPage('orderPage');
  };

  return (
    <div>
      {page === 'landing' && (
        <LandingPage onGetStarted={() => setPage('auth')} />
      )}
      {page === 'auth' && (
        <AuthPage onLogin={handleLogin} />
      )}
      {page === 'farmerDashboard' && (
        <FarmerDashboard user={user} onLogout={handleLogout} />
      )}
      {page === 'buyerMarketplace' && (
        <BuyerMarketplace user={user} onLogout={handleLogout} onOrder={handleOrder} />
      )}
      {page === 'orderPage' && (
        <OrderPage
          user={user}
          crop={selectedCrop}
          onBack={() => setPage('buyerMarketplace')}
          onOrderPlaced={() => setPage('buyerMarketplace')}
        />
      )}
    </div>
  );
}

export default App;