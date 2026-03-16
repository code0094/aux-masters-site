import React, { useState } from 'react';
import '../styles/MixCard.css';

export default function MixCard({ mix }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mix-card">
      <div className="mix-card-header">
        <div className="mix-card-info">
          <h3 className="mix-card-title">{mix.title}</h3>
          <span className="mix-card-artist">{mix.artist}</span>
        </div>
        <div className="mix-card-meta">
          <span className="mix-card-duration">{mix.duration}</span>
          <span className="mix-card-date">{mix.date}</span>
        </div>
      </div>
      
      <p className="mix-card-description">{mix.description}</p>
      
      <div className="mix-card-genres">
        {mix.genres.map((genre, i) => (
          <span key={i} className="mix-card-genre-tag">{genre}</span>
        ))}
      </div>
      
      {mix.soundcloudUrl ? (
        <div className="mix-card-embed">
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(mix.soundcloudUrl)}&color=%23ff3d00&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
          />
        </div>
      ) : (
        <button 
          className="mix-card-placeholder"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="mix-card-placeholder-icon">▶</span>
          <span>СКОРО</span>
        </button>
      )}
      
      <div className="mix-card-line" />
    </div>
  );
}
