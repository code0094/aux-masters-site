import React, { useState, useEffect } from 'react';
import DjCard from '../components/DjCard';
import { getArtists } from '../api/client';
import '../styles/Pages.css';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    getArtists().then(all => {
      setArtists(all.filter(a => a.type === 'dj'));
      setStaff(all.filter(a => a.type === 'staff'));
    }).catch(console.error);
  }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-content">
          <h1 className="page-hero-title">АРТИСТЫ</h1>
          <p className="page-hero-subtitle">НАША КОМАНДА</p>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="page-section">
        <div className="page-container">
          <h2 style={{ 
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            letterSpacing: '0.15em',
            marginBottom: '3rem',
            textAlign: 'center',
            color: '#ff3d00'
          }}>ДИДЖЕИ</h2>
          <div className="artists-page-grid">
            {artists.map((dj, index) => (
              <DjCard key={dj.id} dj={dj} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="page-section" style={{ background: '#111', borderTop: '1px solid rgba(255, 61, 0, 0.3)' }}>
        <div className="page-container">
          <h2 style={{ 
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            letterSpacing: '0.15em',
            marginBottom: '3rem',
            textAlign: 'center',
            color: '#ff3d00'
          }}>СТАФФ</h2>
          <div className="artists-page-grid">
            {staff.map((person, index) => (
              <DjCard key={person.id} dj={person} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
