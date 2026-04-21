import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    alert(`Welcome ${userData.name || userData.email}! Logged in as ${userData.role}`);
  };

  return (
    <div>
      {page === 'landing' && (
        <LandingPage onGetStarted={() => setPage('auth')} />
      )}
      {page === 'auth' && (
        <AuthPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;