import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getArtists, deleteArtist } from '../api';
import Confirm from '../components/Confirm';

export default function ArtistsList({ showToast }) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    getArtists()
      .then(setArtists)
      .catch(e => showToast(e.message, true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = (artist) => {
    setConfirm({
      title: 'Удалить артиста?',
      message: artist.name,
      onConfirm: async () => {
        try {
          await deleteArtist(artist.slug);
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
      <h1 className="admin-page-title">Артисты ({artists.length})</h1>

      <div className="admin-list">
        {artists.map(a => (
          <div key={a.slug} className="admin-list-item">
            <div
              className="admin-list-item-info"
              onClick={() => navigate(`/admin/artists/${a.slug}/edit`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="admin-list-item-title">
                {a.symbol && <span style={{ marginRight: 6 }}>{a.symbol}</span>}
                {a.name}
              </div>
              <div className="admin-list-item-subtitle">
                {a.type === 'dj' ? 'DJ' : a.type === 'mc' ? 'MC' : a.type} {a.role && `· ${a.role}`}
                {a.genres.length > 0 && ` · ${a.genres.join(', ')}`}
              </div>
            </div>
            <div className="admin-list-item-actions">
              <button
                className="admin-btn admin-btn--icon admin-btn--ghost"
                onClick={() => navigate(`/admin/artists/${a.slug}/edit`)}
                title="Редактировать"
              >
                ✎
              </button>
              <button
                className="admin-btn admin-btn--icon admin-btn--ghost"
                onClick={() => handleDelete(a)}
                title="Удалить"
                style={{ color: 'var(--admin-danger)' }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {artists.length === 0 && (
        <div className="admin-empty">
          <div className="admin-empty-icon">♫</div>
          <p>Нет артистов</p>
        </div>
      )}

      <Link to="/admin/artists/new" className="admin-fab" title="Добавить артиста">+</Link>

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
