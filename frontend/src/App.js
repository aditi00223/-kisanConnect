import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerMarketplace from './pages/BuyerMarketplace';
import OrderPage from './pages/OrderPage';
import DemandChart from './pages/DemandChart';
import FarmerProfile from './pages/FarmerProfile';
import ForumPage from './pages/ForumPage';
import WalletPage from './pages/WalletPage';

function AppRoutes() {
  const { user, login, logout } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState(null);
  const navigate = useNavigate();

  // Auto-login if token exists in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'farmer') {
        setPage('farmerDashboard');
      } else {
        setPage('buyerMarketplace');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    login(userData);
    if (userData.role === 'farmer') {
      navigate('/farmer');
    } else {
      navigate('/buyer');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
        <FarmerDashboard
          user={user}
          onLogout={handleLogout}
          onViewProfile={() => setPage('farmerProfile')}
          onViewWallet={() => setPage('walletPage')}
          onViewForum={() => setPage('forumPage')}
        />
      )}

      {page === 'farmerProfile' && (
        <FarmerProfile user={user} onBack={() => setPage('farmerDashboard')} />
      )}

      {page === 'buyerMarketplace' && (
        <BuyerMarketplace
          user={user}
          onLogout={handleLogout}
          onOrder={handleOrder}
          onViewChart={() => setPage('demandChart')}
          onViewForum={() => setPage('forumPage')}
        />
      )}

      {page === 'orderPage' && (
        <OrderPage
          user={user}
          crop={selectedCrop}
          onBack={() => setPage('buyerMarketplace')}
          onOrderPlaced={() => setPage('buyerMarketplace')}
        />
      )}

      {page === 'demandChart' && (
        <DemandChart onBack={() => setPage('buyerMarketplace')} />
      )}

      {page === 'forumPage' && (
        <ForumPage
          user={user}
          onBack={() => user?.role === 'farmer' ? setPage('farmerDashboard') : setPage('buyerMarketplace')}
        />
      )}

      {page === 'walletPage' && (
        <WalletPage user={user} onBack={() => setPage('farmerDashboard')} />
      )}
    </div>
  );
}

export default App;