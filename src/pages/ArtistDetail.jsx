import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getArtist, getArtists } from '../api/client';
import '../styles/Pages.css';

export default function ArtistDetail() {
  const { id } = useParams();
  const [dj, setDj] = useState(null);
  const [otherArtists, setOtherArtists] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getArtist(id)
      .then(data => {
        setDj(data);
        getArtists()
          .then(all => setOtherArtists(all.filter(d => d.id !== id && d.type === data.type).slice(0, 3)))
          .catch(console.error);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <Navigate to="/artists" replace />;
  if (!dj) return null;

  return (
    <div className="page-enter">
      {/* Hero with Photo */}
      <section className="artist-hero">
        {/* Artist Photo - Full Background */}
        {dj.photo && (
          <div 
            className="artist-hero-photo"
            style={{ backgroundImage: `url(${dj.photo})` }}
          />
        )}
        
        {/* Gradient overlay */}
        <div className="artist-hero-gradient" />
        
        <div className="artist-hero-content">
          <span className="artist-hero-symbol">{dj.symbol}</span>
          <h1 className="artist-hero-name">{dj.name}</h1>
          <p className="artist-hero-role">{dj.role}</p>
        </div>
      </section>

      {/* Bio */}
      <section className="page-section">
        <div className="page-container" style={{ maxWidth: '800px' }}>
          <p style={{ 
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
            lineHeight: 1.9, 
            opacity: 0.8, 
            marginBottom: '2rem' 
          }}>
            {dj.fullDesc}
          </p>
          
          {dj.genres && dj.genres.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
              {dj.genres.map((genre, i) => (
                <span key={i} style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  padding: '0.5rem 1rem',
                  border: '1px solid #ff3d00',
                  color: '#ff3d00'
                }}>{genre}</span>
              ))}
            </div>
          )}

          {(dj.soundcloud || dj.instagram || dj.telegram) && (
            <div className="contact-social-links" style={{ 
              flexDirection: 'row', 
              paddingTop: '2rem', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              {dj.soundcloud && (
                <a href={dj.soundcloud} className="contact-social-link" target="_blank" rel="noopener noreferrer">
                  SOUNDCLOUD
                </a>
              )}
              {dj.instagram && (
                <a href={dj.instagram} className="contact-social-link" target="_blank" rel="noopener noreferrer">
                  INSTAGRAM
                </a>
              )}
              {dj.telegram && (
                <a href={dj.telegram} className="contact-social-link" target="_blank" rel="noopener noreferrer">
                  TELEGRAM
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Other Artists */}
      {otherArtists.length > 0 && (
        <section className="page-section" style={{ background: '#111', borderTop: '1px solid rgba(255, 61, 0, 0.3)' }}>
          <div className="page-container" style={{ maxWidth: '800px' }}>
            <h2 style={{ 
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '2rem',
              letterSpacing: '0.15em',
              marginBottom: '2rem'
            }}>{dj.type === 'staff' ? 'ДРУГИЕ УЧАСТНИКИ' : 'ДРУГИЕ АРТИСТЫ'}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
              {otherArtists.map(artist => (
                <Link 
                  key={artist.id} 
                  to={`/artists/${artist.id}`} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '1.5rem',
                    background: '#0a0a0a',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    textDecoration: 'none',
                    color: '#f0f0f0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ fontSize: '1.5rem', color: '#ff3d00' }}>{artist.symbol}</span>
                  <span style={{ 
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.5rem',
                    letterSpacing: '0.1em',
                    flex: 1
                  }}>{artist.name}</span>
                  <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>→</span>
                </Link>
              ))}
            </div>
            
            <Link to="/artists" className="mission-link">
              ← ВСЕ АРТИСТЫ
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
