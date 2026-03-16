import React from 'react';
import '../styles/Pages.css';

export default function Merch() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-content">
          <h1 className="page-hero-title">МЕРЧ</h1>
          <p className="page-hero-subtitle">ОДЕЖДА И АКСЕССУАРЫ</p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="page-section">
        <div className="page-container" style={{ maxWidth: '800px', textAlign: 'center', padding: '6rem 2rem' }}>
          <div className="coming-soon">
            <span className="coming-soon-icon">◉</span>
            <h2 className="coming-soon-title">СКОРО БУДЕТ</h2>
            <p className="coming-soon-text">
              Мы работаем над коллекцией мерча. Следи за обновлениями в наших соцсетях.
            </p>
            <a 
              href="https://t.me/auxmasters" 
              className="coming-soon-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              СЛЕДИТЬ В TELEGRAM →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
