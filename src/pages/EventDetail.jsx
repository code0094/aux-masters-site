import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getEvent, getEvents } from '../api/client';
import '../styles/Pages.css';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [otherEvents, setOtherEvents] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getEvent(id)
      .then(setEvent)
      .catch(() => setNotFound(true));
    getEvents()
      .then(all => setOtherEvents(all.filter(e => e.id !== parseInt(id)).slice(0, 3)))
      .catch(console.error);
  }, [id]);

  if (notFound) return <Navigate to="/events" replace />;
  if (!event) return null;

  const isPast = event.status === 'past';

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="page-enter">
      {/* Hero with Poster */}
      <section className="event-detail-hero">
        {event.poster && (
          <div 
            className="event-detail-hero-bg"
            style={{ backgroundImage: `url(${event.poster})` }}
          />
        )}
        <div className="event-detail-hero-gradient" />
        
        <div className="event-detail-hero-content">
          {isPast && <span className="event-detail-status">ПРОШЕДШЕЕ МЕРОПРИЯТИЕ</span>}
          <h1 className="event-detail-title">{event.title}</h1>
          <div className="event-detail-meta">
            <span className="event-detail-date">{formatDate(event.date)}</span>
            <span className="event-detail-time">{event.time}</span>
          </div>
          <p className="event-detail-venue">{event.venue}, {event.city}</p>
        </div>
      </section>

      {/* Event Info */}
      <section className="page-section">
        <div className="page-container" style={{ maxWidth: '900px' }}>
          
          {/* Poster for past events - large */}
          {isPast && event.poster && (
            <div className="event-detail-poster">
              <img src={event.poster} alt={event.title} />
            </div>
          )}
          
          {/* Description */}
          <div className="event-detail-description">
            <p>{event.description}</p>
          </div>
          
          {/* Lineup */}
          <div className="event-detail-lineup">
            <h2 className="event-detail-section-title">LINE UP</h2>
            <div className="event-detail-lineup-list">
              {event.lineup.map((artist, i) => (
                <div key={i} className="event-detail-lineup-item">{artist}</div>
              ))}
            </div>
          </div>
          
          {/* Ticket button for upcoming */}
          {!isPast && event.ticketLink && (
            <div className="event-detail-cta">
              <a 
                href={event.ticketLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="event-detail-ticket-btn"
              >
                КУПИТЬ БИЛЕТ
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Other Events */}
      {otherEvents.length > 0 && (
        <section className="page-section" style={{ background: '#111', borderTop: '1px solid rgba(255, 61, 0, 0.3)' }}>
          <div className="page-container" style={{ maxWidth: '900px' }}>
            <h2 className="event-detail-section-title">ДРУГИЕ СОБЫТИЯ</h2>
            
            <div className="event-detail-other-list">
              {otherEvents.map(e => (
                <Link 
                  key={e.id} 
                  to={`/events/${e.id}`}
                  className="event-detail-other-item"
                >
                  <span className="event-detail-other-date">
                    {new Date(e.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="event-detail-other-title">{e.title}</span>
                  <span className="event-detail-other-arrow">→</span>
                </Link>
              ))}
            </div>
            
            <Link to="/events" className="mission-link" style={{ marginTop: '2rem', display: 'inline-block' }}>
              ← ВСЕ СОБЫТИЯ
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
