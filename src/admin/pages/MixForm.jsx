import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtists, getMixes, createMix, updateMix } from '../api';
import FormField from '../components/FormField';

const EMPTY = {
  artist_slug: '', title: '', date: '', duration: '',
  soundcloud_url: '', description: '', genres: [],
};

export default function MixForm({ showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [artists, setArtists] = useState([]);
  const [genreInput, setGenreInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getArtists()
      .then(setArtists)
      .catch(e => showToast(e.message, true));
  }, [showToast]);

  useEffect(() => {
    if (!isEdit) return;
    getMixes().then(mixes => {
      const m = mixes.find(x => x.id === Number(id));
      if (m) {
        setForm({
          artist_slug: m.artistSlug || '',
          title: m.title || '',
          date: m.date || '',
          duration: m.duration || '',
          soundcloud_url: m.soundcloudUrl || '',
          description: m.description || '',
          genres: m.genres || [],
        });
      }
    }).catch(e => showToast(e.message, true));
  }, [id, isEdit, showToast]);

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addGenre = () => {
    const g = genreInput.trim();
    if (g && !form.genres.includes(g)) {
      setForm(prev => ({ ...prev, genres: [...prev.genres, g] }));
    }
    setGenreInput('');
  };

  const removeGenre = (g) => {
    setForm(prev => ({ ...prev, genres: prev.genres.filter(x => x !== g) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.artist_slug) {
      showToast('Артист и название обязательны', true);
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await updateMix(id, form);
        showToast('Микс обновлён');
      } else {
        await createMix(form);
        showToast('Микс создан');
      }
      navigate('/admin/mixes');
    } catch (e) {
      showToast(e.message, true);
    } finally {
      setSaving(false);
    }
  };

  const artistOptions = [
    { value: '', label: '— Выбрать артиста —' },
    ...artists.map(a => ({ value: a.slug, label: a.name })),
  ];

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">{isEdit ? 'Редактировать микс' : 'Новый микс'}</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <FormField label="Артист" name="artist_slug" value={form.artist_slug}
          onChange={setField} options={artistOptions} required />
        <FormField label="Название" name="title" value={form.title} onChange={setField}
          placeholder="AUX PODCAST #001" required />
        <FormField label="Дата" name="date" value={form.date} onChange={setField}
          placeholder="2025-01-15" />
        <FormField label="Длительность" name="duration" value={form.duration} onChange={setField}
          placeholder="1:23:45" />
        <FormField label="SoundCloud URL" name="soundcloud_url" value={form.soundcloud_url}
          onChange={setField} placeholder="https://soundcloud.com/..." />
        <FormField label="Описание" name="description" value={form.description}
          onChange={setField} type="textarea" rows={3} />

        {/* Genres */}
        <div className="admin-field">
          <label>Жанры</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={genreInput}
              onChange={e => setGenreInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGenre(); } }}
              placeholder="Techno, House..."
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
            <button type="button" className="admin-btn admin-btn--primary admin-btn--small" onClick={addGenre}>
              +
            </button>
          </div>
          {form.genres.length > 0 && (
            <div className="admin-tags">
              {form.genres.map(g => (
                <span key={g} className="admin-tag">
                  {g}
                  <button type="button" onClick={() => removeGenre(g)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => navigate('/admin/mixes')}>
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
