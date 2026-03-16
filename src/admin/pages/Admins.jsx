import React, { useState, useEffect } from 'react';
import { getAdmins, addAdmin, removeAdmin } from '../api';
import Confirm from '../components/Confirm';

export default function Admins({ showToast }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newId, setNewId] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [adding, setAdding] = useState(false);

  const load = () => {
    getAdmins()
      .then(setAdmins)
      .catch(e => {
        if (e.message.includes('403')) {
          showToast('Только owner может управлять админами', true);
        } else {
          showToast(e.message, true);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async () => {
    const tgId = newId.trim();
    if (!tgId) return;
    setAdding(true);
    try {
      await addAdmin(Number(tgId));
      showToast('Админ добавлен');
      setNewId('');
      load();
    } catch (e) {
      showToast(e.message, true);
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = (admin) => {
    setConfirm({
      title: 'Удалить админа?',
      message: admin.username ? `@${admin.username}` : `ID: ${admin.telegramId}`,
      onConfirm: async () => {
        try {
          await removeAdmin(admin.telegramId);
          showToast('Админ удалён');
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
      <h1 className="admin-page-title">Админы ({admins.length})</h1>

      {/* Add admin */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={newId}
          onChange={e => setNewId(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          placeholder="Telegram ID"
          style={{
            flex: 1,
            background: 'var(--admin-secondary-bg)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '10px 12px',
            color: 'var(--admin-text)',
            fontSize: '0.95rem',
          }}
        />
        <button
          className="admin-btn admin-btn--primary"
          onClick={handleAdd}
          disabled={adding || !newId.trim()}
        >
          {adding ? '...' : 'Добавить'}
        </button>
      </div>

      <div className="admin-list">
        {admins.map(a => (
          <div key={a.id} className="admin-list-item">
            <div className="admin-list-item-info">
              <div className="admin-list-item-title">
                {a.username ? `@${a.username}` : `ID: ${a.telegramId}`}
              </div>
              <div className="admin-list-item-subtitle">
                {a.role === 'owner' ? '👑 Owner' : 'Admin'}
                {' · '}ID: {a.telegramId}
              </div>
            </div>
            {a.role !== 'owner' && (
              <div className="admin-list-item-actions">
                <button
                  className="admin-btn admin-btn--icon admin-btn--ghost"
                  onClick={() => handleRemove(a)}
                  style={{ color: 'var(--admin-danger)' }}
                >✕</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
