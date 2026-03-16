import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { getArtists } from '../api/client';
import '../styles/Pages.css';

export default function About() {
  const [artistCount, setArtistCount] = useState(0);

  useEffect(() => {
    getArtists()
      .then(all => setArtistCount(all.length))
      .catch(console.error);
  }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-content">
          <h1 className="page-hero-title">О НАС</h1>
          <p className="page-hero-subtitle">КТО МЫ И ЗАЧЕМ ВСЁ ЭТО</p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="page-section">
        <div className="page-container">
          <div className="about-big-text">
            <span className="highlight">AUX MASTERS</span> — это не просто команда диджеев.
          </div>
          <div className="about-big-text">
            Это коллектив единомышленников, объединённых страстью к настоящей музыке 
            и андерграундной культуре.
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="page-section-dark">
        <div className="page-container">
          <SectionHeader number="01" title="ЦЕННОСТИ" />
          
          <div className="about-values-grid">
            <div className="about-value-block">
              <span className="about-value-icon">◈</span>
              <h3 className="about-value-title">ЗВУК</h3>
              <p className="about-value-text">
                Мы верим в силу звука, который способен создавать моменты единения на танцполе. 
                Каждый трек — это история, каждый сет — путешествие.
              </p>
            </div>
            
            <div className="about-value-block">
              <span className="about-value-icon">◇</span>
              <h3 className="about-value-title">РАЗНООБРАЗИЕ</h3>
              <p className="about-value-text">
                От атмосферного лаунжа до жёсткого техно — мы исследуем всё пространство 
                электронной музыки, находя в нём жемчужины для наших сетов.
              </p>
            </div>
            
            <div className="about-value-block">
              <span className="about-value-icon">◆</span>
              <h3 className="about-value-title">СООБЩЕСТВО</h3>
              <p className="about-value-text">
                Каждый из нас привносит уникальное видение и стиль, формируя многогранное 
                звучание коллектива. Вместе мы сильнее.
              </p>
            </div>
            
            <div className="about-value-block">
              <span className="about-value-icon">●</span>
              <h3 className="about-value-title">АНДЕРГРАУНД</h3>
              <p className="about-value-text">
                Мы не гонимся за трендами. Наша цель — находить и представлять музыку, 
                которая резонирует с настоящими ценителями.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="page-section">
        <div className="page-container">
          <SectionHeader number="02" title="ИСТОРИЯ" />
          
          <div className="page-container-narrow">
            <p className="about-story-text">
              AUX MASTERS родился из общей страсти к музыке и желания создать пространство 
              для настоящего андерграундного звука.
            </p>
            <p className="about-story-text">
              Мы начали как группа друзей, которые делились находками и играли на небольших 
              вечеринках. Постепенно круг единомышленников расширялся, а наши мероприятия 
              становились всё более масштабными.
            </p>
            <p className="about-story-text">
              Сегодня AUX MASTERS — это шесть уникальных артистов, каждый из которых 
              привносит свой голос в общее звучание. От UK garage до industrial techno, 
              от глубокого грува до экспериментальной электроники.
            </p>
            <p className="about-story-text">
              Наша миссия остаётся неизменной: находить, играть и делиться музыкой, 
              которая двигает.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="page-section-dark">
        <div className="page-container">
          <div className="about-stats-grid">
            <div className="about-stat-block">
              <span className="about-stat-number">{artistCount}</span>
              <span className="about-stat-label">АРТИСТОВ В КОЛЛЕКТИВЕ</span>
            </div>
            <div className="about-stat-block">
              <span className="about-stat-number">∞</span>
              <span className="about-stat-label">ЖАНРОВ В АРСЕНАЛЕ</span>
            </div>
            <div className="about-stat-block">
              <span className="about-stat-number">1</span>
              <span className="about-stat-label">ЦЕЛЬ — ДВИГАТЬ ТАНЦПОЛ</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section" style={{ textAlign: 'center' }}>
        <h2 className="cta-title">ХОЧЕШЬ УЗНАТЬ БОЛЬШЕ?</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          <Link to="/artists" className="mission-link">НАШИ АРТИСТЫ →</Link>
          <Link to="/mixes" className="mission-link">НАШИ МИКСЫ →</Link>
          <Link to="/contact" className="mission-link">СВЯЗАТЬСЯ →</Link>
        </div>
      </section>
    </div>
  );
}
