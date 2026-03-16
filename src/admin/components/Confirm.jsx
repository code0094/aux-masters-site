import React from 'react';

export default function Confirm({ title, message, onConfirm, onCancel, danger = false }) {
  return (
    <div className="admin-confirm-overlay" onClick={onCancel}>
      <div className="admin-confirm-box" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="admin-confirm-actions">
          <button className="admin-btn admin-btn--ghost" onClick={onCancel}>
            Отмена
          </button>
          <button
            className={`admin-btn ${danger ? 'admin-btn--danger' : 'admin-btn--primary'}`}
            onClick={onConfirm}
          >
            {danger ? 'Удалить' : 'Да'}
          </button>
        </div>
      </div>
    </div>
  );
}
