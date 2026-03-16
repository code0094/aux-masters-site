import React, { useState, useEffect } from 'react';
import { getMessages, markMessageRead } from '../api';

export default function Messages({ showToast, onRead }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getMessages()
      .then(data => {
        // Unread first, then by date
        data.sort((a, b) => {
          if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        });
        setMessages(data);
      })
      .catch(e => showToast(e.message, true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleMarkRead = async (msg) => {
    try {
      await markMessageRead(msg.id);
      // Update locally
      setMessages(prev => prev.map(m =>
        m.id === msg.id ? { ...m, isRead: true } : m
      ));
      if (onRead) onRead();
    } catch (e) {
      showToast(e.message, true);
    }
  };

  if (loading) return <div className="admin-loading">Загрузка...</div>;

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">
        Сообщения ({messages.length})
        {unreadCount > 0 && (
          <span style={{ fontSize: '0.9rem', color: 'var(--admin-danger)', marginLeft: 8 }}>
            {unreadCount} новых
          </span>
        )}
      </h1>

      {messages.map(msg => (
        <div key={msg.id} className={`admin-message${!msg.isRead ? ' admin-message--unread' : ''}`}>
          <div className="admin-message-header">
            <span className="admin-message-sender">{msg.name}</span>
            <span className="admin-message-date">
              {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              }) : ''}
            </span>
          </div>
          {msg.subject && <div className="admin-message-subject">{msg.subject}</div>}
          <div className="admin-message-body">{msg.message}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span className="admin-message-email">{msg.email}</span>
            {!msg.isRead && (
              <button
                className="admin-btn admin-btn--primary admin-btn--small"
                onClick={() => handleMarkRead(msg)}
              >
                Прочитано ✓
              </button>
            )}
          </div>
        </div>
      ))}

      {messages.length === 0 && (
        <div className="admin-empty">
          <div className="admin-empty-icon">✉</div>
          <p>Нет сообщений</p>
        </div>
      )}
    </div>
  );
}
