import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-line" />
      <div className="footer-content">
        <Link to="/" className="footer-logo">◉ AUX MASTERS</Link>
        <div className="footer-links">
          <a href="https://t.me/auxmasters" target="_blank" rel="noopener noreferrer" className="footer-link">TG</a>
          <a href="https://soundcloud.com/priozgang" target="_blank" rel="noopener noreferrer" className="footer-link">SC</a>
          <a href="https://www.instagram.com/auxmasters/" target="_blank" rel="noopener noreferrer" className="footer-link">IG</a>
        </div>
        <span className="footer-year">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
