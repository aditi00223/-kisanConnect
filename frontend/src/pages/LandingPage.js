import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const LandingPage = ({ onGetStarted }) => {
  const { t } = useTranslation();
  const [lang, setLang] = useState('en');

  const changeLanguage = (l) => { setLang(l); i18n.changeLanguage(l); };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f7e6 0%, #fffbf2 60%, #fff4ec 100%)', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2f0cc', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px #3B6D1110' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #eaf3de, #fef9ec)', border: '1px solid #c0dd97', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌾</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#27500a' }}>KisanConnect</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['en', 'hi', 'pa'].map((l) => (
            <button key={l} onClick={() => changeLanguage(l)}
              style={{ padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid', transition: 'all 0.2s',
                background: lang === l ? '#3B6D11' : 'transparent',
                color: lang === l ? '#fff' : '#3B6D11',
                borderColor: lang === l ? '#3B6D11' : '#c0dd97' }}>
              {l === 'en' ? 'EN' : l === 'hi' ? 'HI' : 'PA'}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #27500a 0%, #3B6D11 50%, #639922 100%)', padding: '64px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 75% 50%, #f59e0b, transparent 55%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 520, margin: '0 auto', position: 'relative' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>🌾</div>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#c0dd97', margin: '0 0 10px' }}>{t('welcome')}</h1>
          <p style={{ fontSize: 14, color: '#9fe1cb', marginBottom: 36 }}>{t('tagline')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 360, margin: '0 auto' }}>
            <button onClick={onGetStarted}
              style={{ padding: '18px 12px', borderRadius: 18, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: '#fff', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 16px #d9770650', textAlign: 'center' }}>
              🧑‍🌾 {t('farmer')}
              <span style={{ display: 'block', fontSize: 11, fontWeight: 400, opacity: 0.85, marginTop: 4 }}>List &amp; sell crops</span>
            </button>
            <button onClick={onGetStarted}
              style={{ padding: '18px 12px', borderRadius: 18, border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer', background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 700, fontSize: 14, textAlign: 'center' }}>
              🛒 {t('buyer')}
              <span style={{ display: 'block', fontSize: 11, fontWeight: 400, opacity: 0.75, marginTop: 4 }}>Browse &amp; order</span>
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '48px 24px', background: '#fff' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9aab87', textAlign: 'center', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 28 }}>{t('howItWorks')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, maxWidth: 800, margin: '0 auto' }}>
          {[
            { icon: '📋', title: t('step1Title'), desc: t('step1Desc'), iconBg: '#eaf3de', iconBorder: '#c0dd97' },
            { icon: '🔍', title: t('step2Title'), desc: t('step2Desc'), iconBg: '#e6f1fb', iconBorder: '#b5d4f4' },
            { icon: '🤝', title: t('step3Title'), desc: t('step3Desc'), iconBg: '#faeeda', iconBorder: '#fac775' },
          ].map((step, i) => (
            <div key={i} style={{ background: 'linear-gradient(160deg, #f0f7e6, #fffbf4)', borderRadius: 20, padding: 24, textAlign: 'center', border: '1px solid #e2f0cc' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: step.iconBg, border: `1px solid ${step.iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 14px' }}>{step.icon}</div>
              <h3 style={{ fontWeight: 700, color: '#27500a', fontSize: 13, margin: '0 0 8px' }}>{step.title}</h3>
              <p style={{ color: '#9aab87', fontSize: 12, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section style={{ background: '#eaf3de', borderTop: '1px solid #c0dd97', borderBottom: '1px solid #c0dd97', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[
            { num: '2,400+', label: 'Farmers' },
            { num: '0%', label: 'Commission' },
            { num: '18+', label: 'Crops listed' },
            { num: 'Punjab', label: '& growing' },
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: 20, color: '#27500a', margin: 0 }}>{num}</p>
              <p style={{ fontSize: 11, color: '#639922', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1B5E20', color: '#9fe1cb', textAlign: 'center', padding: '16px 24px', fontSize: 12 }}>
        KisanConnect — {t('tagline')}
      </footer>
    </div>
  );
};

export default LandingPage;