import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import FarmerDashboard from './pages/FarmerDashboard';

function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);

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
    </div>
  );
}

export default App;