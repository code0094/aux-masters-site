import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) {
    return <div className="admin-loading">Загрузка...</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">AUX MASTERS</h1>

      <div className="admin-stats">
        <Link to="/admin/artists" className="admin-stat-card">
          <div className="admin-stat-number">{stats.artists}</div>
          <div className="admin-stat-label">Артисты</div>
        </Link>

        <Link to="/admin/events" className="admin-stat-card">
          <div className="admin-stat-number">{stats.events}</div>
          <div className="admin-stat-label">Ивенты</div>
        </Link>

        <Link to="/admin/gallery" className="admin-stat-card">
          <div className="admin-stat-number">{stats.photos}</div>
          <div className="admin-stat-label">Фото</div>
        </Link>

        <Link to="/admin/mixes" className="admin-stat-card">
          <div className="admin-stat-number">{stats.mixes}</div>
          <div className="admin-stat-label">Миксы</div>
        </Link>

        <Link
          to="/admin/messages"
          className={`admin-stat-card${stats.unread > 0 ? ' admin-stat-card--unread' : ''}`}
          style={{ gridColumn: 'span 2' }}
        >
          <div className="admin-stat-number">{stats.unread}</div>
          <div className="admin-stat-label">Непрочитанных сообщений</div>
        </Link>
      </div>

      <Link to="/admin/admins" className="admin-stat-card" style={{ display: 'block', textAlign: 'center' }}>
        <div className="admin-stat-label" style={{ fontSize: '0.85rem' }}>⚙ Управление админами</div>
      </Link>
    </div>
  );
}
