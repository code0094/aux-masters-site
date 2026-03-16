import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvents, createEvent, updateEvent } from '../api';
import FormField from '../components/FormField';

const EMPTY = {
  title: '', date: '', time: '', venue: '', city: '',
  description: '', status: 'upcoming', ticket_link: '', poster_url: '',
  lineup: [],
};

const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

export default function EventForm({ showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [lineupInput, setLineupInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    getEvents().then(events => {
      const ev = events.find(x => x.id === Number(id));
      if (ev) {
        setForm({
          title: ev.title || '',
          date: ev.date || '',
          time: ev.time || '',
          venue: ev.venue || '',
          city: ev.city || '',
          description: ev.description || '',
          status: ev.status || 'upcoming',
          ticket_link: ev.ticketLink || '',
          poster_url: ev.poster || '',
          lineup: ev.lineup || [],
        });
      }
    }).catch(e => showToast(e.message, true));
  }, [id, isEdit, showToast]);

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addLineup = () => {
    const name = lineupInput.trim();
    if (name && !form.lineup.includes(name)) {
      setForm(prev => ({ ...prev, lineup: [...prev.lineup, name] }));
    }
    setLineupInput('');
  };

  const removeLineup = (name) => {
    setForm(prev => ({ ...prev, lineup: prev.lineup.filter(x => x !== name) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) {
      showToast('Название и дата обязательны', true);
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await updateEvent(id, form);
        showToast('Ивент обновлён');
      } else {
        await createEvent(form);
        showToast('Ивент создан');
      }
      navigate('/admin/events');
    } catch (e) {
      showToast(e.message, true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">{isEdit ? 'Редактировать ивент' : 'Новый ивент'}</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <FormField label="Название" name="title" value={form.title} onChange={setField}
          placeholder="BAD AUX" required />
        <FormField label="Дата (YYYY-MM-DD)" name="date" type="date" value={form.date}
          onChange={setField} required />
        <FormField label="Время" name="time" value={form.time} onChange={setField}
          placeholder="23:00 – 06:00" />
        <FormField label="Площадка" name="venue" value={form.venue} onChange={setField}
          placeholder="MUTABOR" />
        <FormField label="Город" name="city" value={form.city} onChange={setField}
          placeholder="Москва" />
        <FormField label="Статус" name="status" value={form.status} onChange={setField}
          options={STATUS_OPTIONS} />
        <FormField label="Описание" name="description" value={form.description}
          onChange={setField} type="textarea" rows={3} />
        <FormField label="Ссылка на билеты" name="ticket_link" value={form.ticket_link}
          onChange={setField} placeholder="https://..." />
        <FormField label="Постер URL" name="poster_url" value={form.poster_url}
          onChange={setField} placeholder="/images/events/poster.jpg" />

        {/* Lineup */}
        <div className="admin-field">
          <label>Лайнап</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={lineupInput}
              onChange={e => setLineupInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLineup(); } }}
              placeholder="Имя артиста"
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
            <button type="button" className="admin-btn admin-btn--primary admin-btn--small" onClick={addLineup}>
              +
            </button>
          </div>
          {form.lineup.length > 0 && (
            <div className="admin-tags">
              {form.lineup.map(name => (
                <span key={name} className="admin-tag">
                  {name}
                  <button type="button" onClick={() => removeLineup(name)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => navigate('/admin/events')}>
            Отмена
          </button>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
}
