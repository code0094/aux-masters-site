import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import EventCard from '../components/EventCard';
import { getEvents } from '../api/client';
import '../styles/Pages.css';

export default function Events() {
  const [upcomingEvents, setUpcoming] = useState([]);
  const [pastEvents, setPast] = useState([]);

  useEffect(() => {
    getEvents('upcoming').then(setUpcoming).catch(console.error);
    getEvents('past').then(setPast).catch(console.error);
  }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-content">
          <h1 className="page-hero-title">СОБЫТИЯ</h1>
          <p className="page-hero-subtitle">ВЕЧЕРИНКИ, РЕЙВЫ, АНДЕРГРАУНД</p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="page-section">
        <div className="page-container">
          <SectionHeader number="01" title="СКОРО" />
          
          {upcomingEvents.length > 0 ? (
            <div className="mixes-grid">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div style={{ 
              padding: '4rem', 
              background: '#111', 
              textAlign: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.1)'
            }}>
              <p style={{ 
                fontFamily: "'VT323', sans-serif",
                fontSize: '2rem',
                letterSpacing: '0.15em',
                marginBottom: '0.5rem'
              }}>СЛЕДИТЕ ЗА ОБНОВЛЕНИЯМИ</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.4 }}>
                Новые события скоро будут анонсированы
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="page-section-dark">
          <div className="page-container">
            <SectionHeader number="02" title="АРХИВ" />
            
            <div className="mixes-grid">
              {pastEvents.map(event => (
                <EventCard key={event.id} event={event} isPast />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="page-section" style={{ textAlign: 'center' }}>
        <h2 className="cta-title">ХОЧЕШЬ ПРИГЛАСИТЬ НАС?</h2>
        <p className="cta-text">
          Организуешь вечеринку? Свяжись с нами
        </p>
        <a href="mailto:booking@auxmasters.com" className="contact-info-link" style={{ fontSize: '1.5rem' }}>
          BOOKING@AUXMASTERS.COM
        </a>
      </section>
    </div>
  );
}
