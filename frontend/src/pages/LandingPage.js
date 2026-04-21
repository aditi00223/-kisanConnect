import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const LandingPage = ({ onGetStarted }) => {
  const { t } = useTranslation();
  const [lang, setLang] = useState('en');

  const changeLanguage = (l) => {
    setLang(l);
    i18n.changeLanguage(l);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="text-xl font-bold text-green-700">KisanConnect</span>
        </div>
        <div className="flex gap-2">
          {['en', 'hi', 'pa'].map((l) => (
            <button
              key={l}
              onClick={() => changeLanguage(l)}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                lang === l
                  ? 'bg-green-600 text-white border-green-600'
                  : 'text-green-700 border-green-300'
              }`}
            >
              {l === 'en' ? 'EN' : l === 'hi' ? 'HI' : 'PA'}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-green-700 text-white px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
        <p className="text-orange-300 text-lg font-medium mb-8">{t('tagline')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold px-8 py-4 rounded-xl">
            🧑‍🌾 {t('farmer')} — {t('register')}
          </button>
          <button
            onClick={onGetStarted}
            className="bg-white hover:bg-gray-100 text-green-700 text-lg font-bold px-8 py-4 rounded-xl">
            🛒 {t('buyer')} — {t('register')}
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-8">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: '📋', title: 'Farmer Lists Crop', desc: 'Add crop name, price, quantity and farm location' },
            { icon: '🔍', title: 'Buyer Browses', desc: 'Compare prices from multiple farmers for same crop' },
            { icon: '🤝', title: 'Direct Deal', desc: 'Order, pay via UPI or cash, collect from farm' },
          ].map((step, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-6">
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="font-bold text-green-700 text-lg mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-orange-50 px-6 py-8 text-center">
        <p className="text-orange-600 font-bold text-lg">
          ⭐ Trusted by 1000+ Farmers across Punjab, Haryana & UP
        </p>
        <p className="text-gray-500 text-sm mt-1">No commission. No middleman. Full price to the farmer.</p>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center py-4 text-sm">
        🌾 KisanConnect — Seedha Kisan, Seedha Daam
      </footer>

    </div>
  );
};

export default LandingPage;