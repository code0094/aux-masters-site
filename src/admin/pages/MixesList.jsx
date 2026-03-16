import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMixes, deleteMix } from '../api';
import Confirm from '../components/Confirm';

export default function MixesList({ showToast }) {
  const [mixes, setMixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    getMixes()
      .then(setMixes)
      .catch(e => showToast(e.message, true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = (mix) => {
    setConfirm({
      title: 'Удалить микс?',
      message: mix.title,
      onConfirm: async () => {
        try {
          await deleteMix(mix.id);
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
      <h1 className="admin-page-title">Миксы ({mixes.length})</h1>

      <div className="admin-list">
        {mixes.map(m => (
          <div key={m.id} className="admin-list-item">
            <div className="admin-list-item-info">
              <div className="admin-list-item-title">{m.title}</div>
              <div className="admin-list-item-subtitle">
                {m.artist} {m.date && `· ${m.date}`} {m.duration && `· ${m.duration}`}
                {m.genres.length > 0 && ` · ${m.genres.join(', ')}`}
              </div>
            </div>
            <div className="admin-list-item-actions">
              <button
                className="admin-btn admin-btn--icon admin-btn--ghost"
                onClick={() => navigate(`/admin/mixes/${m.id}/edit`)}
              >✎</button>
              <button
                className="admin-btn admin-btn--icon admin-btn--ghost"
                onClick={() => handleDelete(m)}
                style={{ color: 'var(--admin-danger)' }}
              >✕</button>
            </div>
          </div>
        ))}
      </div>

      {mixes.length === 0 && (
        <div className="admin-empty">
          <div className="admin-empty-icon">▶</div>
          <p>Нет миксов</p>
        </div>
      )}

      <Link to="/admin/mixes/new" className="admin-fab">+</Link>

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
