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
    <div className="min-h-screen bg-[#f5f5f0] font-sans">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span style={{fontSize: '24px'}}>🌾</span>
          <span className="text-xl font-bold text-[#2E7D32]">KisanConnect</span>
        </div>
        <div className="flex gap-2">
          {['en', 'hi', 'pa'].map((l) => (
            <button
              key={l}
              onClick={() => changeLanguage(l)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                lang === l
                  ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                  : 'text-[#2E7D32] border-[#2E7D32] bg-white'
              }`}
            >
              {l === 'en' ? 'EN' : l === 'hi' ? 'HI' : 'PA'}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#2E7D32] px-6 py-14 text-center">
        <div className="max-w-xl mx-auto">
          <div style={{fontSize: '64px', marginBottom: '16px'}}>🌾</div>
          <h1 className="text-3xl font-bold text-[#C0DD97] mb-2">
            {t('welcome')}
          </h1>
          <p className="text-[#9FE1CB] text-base mb-10">
            {t('tagline')}
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onClick={onGetStarted}
              className="bg-[#FF8F00] hover:bg-[#e67e00] text-white font-bold px-6 py-4 rounded-2xl text-sm transition-all shadow-md">
              🧑‍🌾 {t('farmer')}
              <span className="block text-xs font-normal opacity-80 mt-1">List & sell crops</span>
            </button>
            <button
              onClick={onGetStarted}
              className="bg-white hover:bg-gray-50 text-[#2E7D32] font-bold px-6 py-4 rounded-2xl text-sm transition-all shadow-md">
              🛒 {t('buyer')}
              <span className="block text-xs font-normal opacity-70 mt-1">Browse & order</span>
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-12 bg-white">
        <h2 className="text-xs font-medium text-gray-400 text-center uppercase tracking-widest mb-8">
          {t('howItWorks')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { icon: '📋', title: t('step1Title'), desc: t('step1Desc'), color: 'bg-[#E8F5E9]' },
            { icon: '🔍', title: t('step2Title'), desc: t('step2Desc'), color: 'bg-[#E3F2FD]' },
            { icon: '🤝', title: t('step3Title'), desc: t('step3Desc'), color: 'bg-[#FFF8E1]' },
          ].map((step, i) => (
            <div key={i} className="bg-[#f5f5f0] rounded-2xl p-6 text-center border border-gray-100">
              <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-4`}>
                {step.icon}
              </div>
              <h3 className="font-bold text-[#2E7D32] text-sm mb-2">{step.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-[#E8F5E9] border-y border-[#C0DD97] px-6 py-6">
        <div className="flex justify-center gap-10 flex-wrap">
          {[
            { num: '2,400+', label: 'Farmers' },
            { num: '0%', label: 'Commission' },
            { num: '18+', label: 'Crops listed' },
            { num: 'Punjab', label: '& growing' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-bold text-[#2E7D32]">{item.num}</div>
              <div className="text-xs text-[#3B6D11]">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B5E20] text-[#9FE1CB] text-center py-4 text-xs">
        KisanConnect — {t('tagline')}
      </footer>

    </div>
  );
};

export default LandingPage;