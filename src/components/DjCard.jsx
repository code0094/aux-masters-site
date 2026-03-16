import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DjCard.css';

export default function DjCard({ dj, index, compact = false }) {
  if (compact) {
    return (
      <Link to={`/artists/${dj.id}`} className="dj-card-compact">
        <span className="compact-symbol">{dj.symbol}</span>
        <div className="compact-info">
          <h3 className="compact-name">{dj.name}</h3>
          <span className="compact-role">{dj.role}</span>
        </div>
        <span className="compact-arrow">→</span>
        <div className="dj-card-line" />
      </Link>
    );
  }

  return (
    <Link 
      to={`/artists/${dj.id}`}
      className="dj-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="dj-card-header">
        <span className="dj-symbol">{dj.symbol}</span>
        <span className="dj-index">0{index + 1}</span>
      </div>
      
      <h3 className="dj-name">{dj.name}</h3>
      <span className="dj-role">{dj.role}</span>
      
      <p className="dj-description">{dj.shortDesc}</p>
      
      <div className="dj-genres">
        {dj.genres.map((genre, i) => (
          <span key={i} className="genre-tag">{genre}</span>
        ))}
      </div>
      
      <div className="dj-card-line" />
    </Link>
  );
}
