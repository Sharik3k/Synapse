import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import './Footer.css';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">
            <Sparkles />
            <a href="/">Synapse</a>
          </div>
          <p>{t('footer_brand')}</p>
        </div>
        <div className="footer-links">
          <div className="link-column">
            <h4>{t('product')}</h4>
            <a href="#">{t('features')}</a>
            <a href="#">{t('pricing')}</a>
            <a href="#">{t('security')}</a>
          </div>
          <div className="link-column">
            <h4>{t('resources')}</h4>
            <a href="#">{t('docs')}</a>
            <a href="#">{t('api_reference')}</a>
            <a href="#">{t('guides')}</a>
          </div>
          <div className="link-column">
            <h4>{t('company')}</h4>
            <a href="#">{t('about')}</a>
            <a href="#">{t('blog')}</a>
            <a href="#">{t('contact')}</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {t('copyright')}</p>
      </div>
    </footer>
  );
}

export default Footer;
