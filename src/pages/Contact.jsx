import React, { useState } from 'react';
import { sendContact } from '../api/client';
import '../styles/Pages.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'booking',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await sendContact(formData);
      setSubmitted(true);
    } catch {
      setError('Ошибка отправки. Попробуйте позже.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-content">
          <h1 className="page-hero-title">КОНТАКТ</h1>
          <p className="page-hero-subtitle">СВЯЖИСЬ С НАМИ</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="page-section">
        <div className="page-container">
          <div className="contact-grid">
            {/* Info */}
            <div>
              <div className="contact-info-block">
                <h3 className="contact-info-title">БУКИНГ</h3>
                <p className="contact-info-text">
                  Для бронирования артистов на ваше мероприятие
                </p>
                <a href="mailto:booking@auxmasters.com" className="contact-info-link">
                  booking@auxmasters.com
                </a>
              </div>

              <div className="contact-info-block">
                <h3 className="contact-info-title">ОБЩИЕ ВОПРОСЫ</h3>
                <p className="contact-info-text">
                  Коллаборации, пресса, предложения
                </p>
                <a href="mailto:hello@auxmasters.com" className="contact-info-link">
                  hello@auxmasters.com
                </a>
              </div>

              <div className="contact-info-block">
                <h3 className="contact-info-title">СОЦИАЛЬНЫЕ СЕТИ</h3>
                <div className="contact-social-links">
                  <a href="https://t.me/auxmasters" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                    <span className="contact-social-icon">▲</span>
                    TELEGRAM
                  </a>
                  <a href="https://soundcloud.com/priozgang" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                    <span className="contact-social-icon">◉</span>
                    SOUNDCLOUD
                  </a>
                  <a href="https://www.instagram.com/auxmasters/" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                    <span className="contact-social-icon">◧</span>
                    INSTAGRAM
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="contact-form">
                  {error && (
                    <div style={{
                      background: 'rgba(255,61,0,0.15)',
                      border: '1px solid rgba(255,61,0,0.3)',
                      borderRadius: 8,
                      padding: '12px 16px',
                      color: '#ff3d00',
                      marginBottom: 16,
                      fontSize: '0.9rem',
                    }}>
                      {error}
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">ИМЯ</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">EMAIL</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">ТЕМА</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="booking">Букинг</option>
                      <option value="collab">Коллаборация</option>
                      <option value="press">Пресса</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">СООБЩЕНИЕ</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="form-textarea"
                    />
                  </div>

                  <button type="submit" className="form-submit" disabled={sending}>
                    {sending ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ'}
                  </button>
                </form>
              ) : (
                <div className="form-success">
                  <span className="form-success-icon">✓</span>
                  <h3 className="form-success-title">ОТПРАВЛЕНО</h3>
                  <p className="form-success-text">
                    Спасибо за сообщение! Мы свяжемся с вами в ближайшее время.
                  </p>
                  <button 
                    className="form-reset-btn"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'booking', message: '' });
                    }}
                  >
                    ОТПРАВИТЬ ЕЩЁ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
