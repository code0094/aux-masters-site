import React, { useState, useEffect } from 'react';
import { getMixes } from '../api/client';
import '../styles/Pages.css';

export default function Mixes() {
  const [mixes, setMixes] = useState([]);

  useEffect(() => {
    getMixes().then(setMixes).catch(console.error);
  }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-content">
          <h1 className="page-hero-title">МИКСЫ</h1>
          <p className="page-hero-subtitle">СЕТЫ, ПОДКАСТЫ, ЗАПИСИ</p>
        </div>
      </section>

      {/* Mixes List */}
      <section className="page-section">
        <div className="page-container" style={{ maxWidth: '900px' }}>
          {mixes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
              <div className="coming-soon">
                <span className="coming-soon-icon">◉</span>
                <h2 className="coming-soon-title">СКОРО БУДЕТ</h2>
                <p className="coming-soon-text">
                  Мы работаем над этим разделом. Совсем скоро здесь появятся наши миксы и подкасты.
                </p>
                <a
                  href="https://soundcloud.com/priozgang"
                  className="coming-soon-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  А ПОКА — СЛУШАЙ НА SOUNDCLOUD →
                </a>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {mixes.map(mix => (
                <div key={mix.id} style={{
                  padding: '2rem',
                  background: '#111',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '1.5rem',
                      letterSpacing: '0.1em',
                    }}>{mix.title}</h3>
                    <span style={{ fontSize: '0.8rem', opacity: 0.4, whiteSpace: 'nowrap', marginLeft: '1rem' }}>{mix.duration}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', opacity: 0.5, marginBottom: '0.75rem' }}>
                    {mix.artist} — {mix.date}
                  </p>
                  {mix.genres.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      {mix.genres.map((g, i) => (
                        <span key={i} style={{
                          fontSize: '0.7rem',
                          letterSpacing: '0.1em',
                          padding: '0.25rem 0.75rem',
                          border: '1px solid #ff3d00',
                          color: '#ff3d00',
                        }}>{g}</span>
                      ))}
                    </div>
                  )}
                  {mix.description && (
                    <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: 1.6 }}>{mix.description}</p>
                  )}
                  {mix.soundcloudUrl && (
                    <a
                      href={mix.soundcloudUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: '1rem',
                        color: '#ff3d00',
                        fontSize: '0.85rem',
                        letterSpacing: '0.1em',
                        textDecoration: 'none',
                      }}
                    >
                      СЛУШАТЬ НА SOUNDCLOUD →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
