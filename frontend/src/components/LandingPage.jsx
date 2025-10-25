import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Shield, Layers, ArrowRight } from 'lucide-react';
import InteractiveMap from './InteractiveMap';
import HeroMap from './HeroMap';
import './LandingPage.css';

function LandingPage({ onJoin }) {
  const { t } = useTranslation();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <main className="hero-section">
        <HeroMap />
        <div className="hero-badge">{t('hero_badge')}</div>
        <h1 className="hero-title">
          {t('hero_title_1')}
          <br />
          {t('hero_title_2')} <span className="hero-title-black">Synapse</span>
        </h1>
        <p className="hero-subtitle">{t('hero_subtitle')}</p>
        <div className="hero-actions">
          <button className="hero-cta primary" onClick={onJoin}>{t('start_building')} <ArrowRight size={16} /></button>
          <button className="hero-cta secondary">{t('view_documentation')}</button>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2>{t('features_title')}</h2>
        <p className="features-subtitle">{t('features_subtitle')}</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Zap /></div>
            <h3>{t('feature_1_title')}</h3>
            <p>{t('feature_1_desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Shield /></div>
            <h3>{t('feature_2_title')}</h3>
            <p>{t('feature_2_desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Layers /></div>
            <h3>{t('feature_3_title')}</h3>
            <p>{t('feature_3_desc')}</p>
          </div>
        </div>
      </section>

      <InteractiveMap />

      {/* CTA Section */}
      <section className="cta-section">
        <h2>{t('cta_title')}</h2>
        <p>{t('cta_subtitle')}</p>
        <div className="cta-actions">
          <button className="cta-btn primary" onClick={onJoin}>{t('get_started_free')} <ArrowRight size={16} /></button>
          <button className="cta-btn secondary">{t('schedule_demo')}</button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
