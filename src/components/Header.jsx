import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const navLinks = [
    { path: '/', label: 'ГЛАВНАЯ' },
    { path: '/about', label: 'О НАС' },
    { path: '/artists', label: 'АРТИСТЫ' },
    { path: '/events', label: 'СОБЫТИЯ' },
    { path: '/gallery', label: 'ГАЛЕРЕЯ' },
    { path: '/mixes', label: 'МИКСЫ' },
    { path: '/merch', label: 'МЕРЧ' },
    { path: '/contact', label: 'КОНТАКТ' },
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <Link to="/" className="logo">
        <span className="logo-icon">◉</span>
        AUX MASTERS
      </Link>

      {/* Desktop Nav */}
      <nav className="nav">
        {navLinks.map(link => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button 
        className={`menu-button ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span className="menu-line" />
        <span className="menu-line" />
        <span className="menu-line" />
      </button>

      {/* Mobile Nav */}
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
