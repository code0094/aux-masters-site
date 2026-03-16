import React from 'react';
import '../styles/Home.css';

export default function SectionHeader({ number, title }) {
  return (
    <div className="section-header">
      <span className="section-number">{number}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}
