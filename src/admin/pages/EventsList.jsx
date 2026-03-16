import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEvents, deleteEvent } from '../api';
import Confirm from '../components/Confirm';

export default function EventsList({ showToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    getEvents()
      .then(data => {
        // Sort by date descending
        data.sort((a, b) => b.date.localeCompare(a.date));
        setEvents(data);
      })
      .catch(e => showToast(e.message, true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = (event) => {
    setConfirm({
      title: 'Удалить ивент?',
      message: event.title,
      onConfirm: async () => {
        try {
          await deleteEvent(event.id);
          showToast('Удалено');
          setConfirm(null);
          load();
        } catch (e) {
          showToast(e.message, true);
        }
      },
    });
  };

  if (loading) return <div className="admin-loading">Загрузка...</div>;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Ивенты ({events.length})</h1>

      <div className="admin-list">
        {events.map(ev => (
          <div key={ev.id} className="admin-list-item">
            <div
              className="admin-list-item-info"
              onClick={() => navigate(`/admin/events/${ev.id}/edit`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="admin-list-item-title">{ev.title}</div>
              <div className="admin-list-item-subtitle">
                {ev.date} {ev.time && `· ${ev.time}`} {ev.venue && `· ${ev.venue}`}
                {' '}
                <span style={{
                  color: ev.status === 'upcoming' ? 'var(--admin-accent)' : 'var(--admin-hint)',
                  fontSize: '0.75rem',
                }}>
                  {ev.status === 'upcoming' ? '● SOON' : '○ PAST'}
                </span>
              </div>
            </div>
            <div className="admin-list-item-actions">
              <button
                className="admin-btn admin-btn--icon admin-btn--ghost"
                onClick={() => navigate(`/admin/events/${ev.id}/edit`)}
              >✎</button>
              <button
                className="admin-btn admin-btn--icon admin-btn--ghost"
                onClick={() => handleDelete(ev)}
                style={{ color: 'var(--admin-danger)' }}
              >✕</button>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="admin-empty">
          <div className="admin-empty-icon">◈</div>
          <p>Нет ивентов</p>
        </div>
      )}

      <Link to="/admin/events/new" className="admin-fab">+</Link>

      {confirm && (
        <Confirm
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
          danger
        />
      )}
    </div>
  );
}
