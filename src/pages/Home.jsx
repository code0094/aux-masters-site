import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DjCard from '../components/DjCard';
import { getArtists, getEvents } from '../api/client';
import '../styles/Home.css';

export default function Home() {
  const [featuredDjs, setFeaturedDjs] = useState([]);
  const [upcomingEvent, setUpcomingEvent] = useState(null);

  useEffect(() => {
    getArtists()
      .then(all => setFeaturedDjs(all.filter(a => a.type !== 'staff').slice(0, 3)))
      .catch(console.error);
    getEvents('upcoming')
      .then(list => setUpcomingEvent(list[0] || null))
      .catch(console.error);
  }, []);

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" />
        
        <div className="hero-content">
          <div className="hero-logo-wrapper">
            <img 
              src="/images/logo.png" 
              alt="AUX MASTERS" 
              className="hero-logo"
            />
          </div>
          <p className="hero-subtitle">UNDERGROUND DJ COLLECTIVE</p>
          <p className="hero-tagline">
            Команда диджеев, специализирующаяся на андерграундном звуке и нишевых жанрах
          </p>
        </div>
        
        <a href="#event" className="scroll-indicator">
          <span className="scroll-text">SCROLL</span>
          <div className="scroll-arrow">↓</div>
        </a>
      </section>

      {/* Upcoming Event with Poster */}
      {upcomingEvent && (
        <section id="event" className="poster-section">
          <div className="poster-container">
            <div className="poster-image-wrapper">
              {upcomingEvent.poster ? (
                <img 
                  src={upcomingEvent.poster} 
                  alt={upcomingEvent.title}
                  className="poster-image"
                />
              ) : (
                <div className="poster-placeholder">
                  <span className="poster-placeholder-icon">◉</span>
                  <span className="poster-placeholder-text">АФИША СКОРО</span>
                </div>
              )}
            </div>
            <div className="poster-info">
              <span className="poster-label">БЛИЖАЙШЕЕ СОБЫТИЕ</span>
              <h2 className="poster-title">{upcomingEvent.title}</h2>
              <div className="poster-details">
                <p className="poster-date">
                  {new Date(upcomingEvent.date).toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p className="poster-venue">{upcomingEvent.venue}, {upcomingEvent.city}</p>
                <p className="poster-time">{upcomingEvent.time}</p>
              </div>
              <p className="poster-description">{upcomingEvent.description}</p>
              <a 
                href={upcomingEvent.ticketLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="poster-button"
              >
                КУПИТЬ БИЛЕТ В TELEGRAM
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Mission Section */}
      <section id="mission" className="mission-section">
        <div className="section-header">
          <span className="section-number">01</span>
          <h2 className="section-title">МИССИЯ</h2>
        </div>
        <div className="mission-content">
          <p className="mission-text">
            <span className="highlight">AUX MASTERS</span> — это коллектив единомышленников, 
            объединённых страстью к настоящей музыке и андерграундной культуре.
          </p>
          <p className="mission-text">
            Мы верим в силу звука, который способен создавать моменты единения на танцполе.
          </p>
          <Link to="/about" className="mission-link">
            ПОДРОБНЕЕ О НАС →
          </Link>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="artists-section">
        <div className="section-header">
          <span className="section-number">02</span>
          <h2 className="section-title">АРТИСТЫ</h2>
        </div>
        <div className="artists-grid">
          {featuredDjs.map((dj, index) => (
            <DjCard key={dj.id} dj={dj} index={index} />
          ))}
        </div>
        <Link to="/artists" className="view-all-link">
          ВСЕ АРТИСТЫ →
        </Link>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">ХОЧЕШЬ РАБОТАТЬ С НАМИ?</h2>
        <p className="cta-text">Букинг, коллаборации, предложения</p>
        <Link to="/contact" className="cta-button">
          СВЯЗАТЬСЯ
        </Link>
      </section>
    </div>
  );
}
