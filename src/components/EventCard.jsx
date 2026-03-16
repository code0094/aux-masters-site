import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/EventCard.css';

export default function EventCard({ event, isPast = false }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('ru', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return { day, month, year };
  };

  const { day, month, year } = formatDate(event.date);

  return (
    <Link to={`/events/${event.id}`} className={`event-card ${isPast ? 'past' : ''}`}>
      {/* Poster only for upcoming events */}
      {!isPast && event.poster && (
        <div className="event-poster event-poster-small">
          <img src={event.poster} alt={event.title} />
        </div>
      )}
      
      <div className="event-card-body">
        <div className="event-date-block">
          <span className="event-day">{day}</span>
          <span className="event-month">{month}</span>
          <span className="event-year">{year}</span>
        </div>
        
        <div className="event-content">
          <h3 className="event-title">{event.title}</h3>
          
          <div className="event-meta">
            <span className="event-meta-item">
              <span className="event-meta-icon">◉</span>
              {event.time}
            </span>
            <span className="event-meta-item">
              <span className="event-meta-icon">◇</span>
              {event.venue}
            </span>
            <span className="event-meta-item">
              <span className="event-meta-icon">◈</span>
              {event.city}
            </span>
          </div>
          
          <p className="event-description">{event.description}</p>
          
          <span className="event-view-more">ПОДРОБНЕЕ →</span>
        </div>
        
        {isPast && (
          <span className="event-past-label">ПРОШЛО</span>
        )}
      </div>
      
      <div className="event-card-line" />
    </Link>
  );
}
