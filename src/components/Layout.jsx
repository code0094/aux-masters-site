import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Noise Overlay */}
      <div className="noise-overlay" />
      
      {/* Scanlines */}
      <div className="scanlines" />
      
      {/* Cursor Glow */}
      <div style={{
        position: 'fixed',
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(255, 61, 0, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'left 0.15s ease-out, top 0.15s ease-out',
        borderRadius: '50%',
        left: mousePos.x - 150,
        top: mousePos.y - 150,
      }} />

      <Header />
      
      <main style={{ minHeight: '100vh' }}>
        {children}
      </main>
      
      <Footer />
    </>
  );
}
