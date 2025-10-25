import React from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import './Header.css';

function Header({ onJoin, theme, toggleTheme }) {
  const { t } = useTranslation();

  return (
    <header className="app-header-main">
      <div className="header-content">
        <div className="logo">
          <Sparkles />
          <a href="/">Synapse</a>
        </div>
        <nav className="main-nav">
          <a href="#features" className="nav-link">{t('features')}</a>
          <a href="#platform" className="nav-link">{t('platform')}</a>
          <a href="#docs" className="nav-link">{t('docs')}</a>
          <a href="#interactive-map" className="nav-link">{t('map')}</a>
        </nav>
        <div className="header-actions">
                    <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <LanguageSwitcher />
          <button className="get-started-btn" onClick={onJoin}>{t('get_started')}</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
