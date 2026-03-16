import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtists, createArtist, updateArtist } from '../api';
import FormField from '../components/FormField';

const EMPTY = {
  slug: '', name: '', type: 'dj', role: '', short_desc: '', full_desc: '',
  symbol: '', photo_url: '', soundcloud_url: '', instagram_url: '', telegram_url: '',
  genres: [],
};

const TYPE_OPTIONS = [
  { value: 'dj', label: 'DJ' },
  { value: 'mc', label: 'MC' },
  { value: 'producer', label: 'Producer' },
  { value: 'resident', label: 'Resident' },
];

export default function ArtistForm({ showToast }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(slug);

  const [form, setForm] = useState(EMPTY);
  const [genreInput, setGenreInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Load existing artist for edit
  useEffect(() => {
    if (!isEdit) return;
    getArtists().then(artists => {
      const a = artists.find(x => x.slug === slug);
      if (a) {
        setForm({
          slug: a.slug,
          name: a.name,
          type: a.type || 'dj',
          role: a.role || '',
          short_desc: a.shortDesc || '',
          full_desc: a.fullDesc || '',
          symbol: a.symbol || '',
          photo_url: a.photo || '',
          soundcloud_url: a.soundcloud || '',
          instagram_url: a.instagram || '',
          telegram_url: a.telegram || '',
          genres: a.genres || [],
        });
      }
    }).catch(e => showToast(e.message, true));
  }, [slug, isEdit, showToast]);

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
    if (!form.slug || !form.name) {
      showToast('Slug и имя обязательны', true);
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await updateArtist(slug, form);
        showToast('Артист обновлён');
      } else {
        await createArtist(form);
        showToast('Артист создан');
      }
      navigate('/admin/artists');
    } catch (e) {
      showToast(e.message, true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">{isEdit ? 'Редактировать' : 'Новый артист'}</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <FormField label="Slug (ID)" name="slug" value={form.slug} onChange={setField}
          placeholder="stress303" required />
        <FormField label="Имя" name="name" value={form.name} onChange={setField}
          placeholder="STRESS 303" required />
        <FormField label="Тип" name="type" value={form.type} onChange={setField}
          options={TYPE_OPTIONS} />
        <FormField label="Роль" name="role" value={form.role} onChange={setField}
          placeholder="Resident / Founder / ..." />
        <FormField label="Символ" name="symbol" value={form.symbol} onChange={setField}
          placeholder="◉" />
        <FormField label="Короткое описание" name="short_desc" value={form.short_desc}
          onChange={setField} type="textarea" rows={2} />
        <FormField label="Полное описание" name="full_desc" value={form.full_desc}
          onChange={setField} type="textarea" rows={4} />
        <FormField label="Фото URL" name="photo_url" value={form.photo_url} onChange={setField}
          placeholder="/images/artists/photo.jpg" />
        <FormField label="SoundCloud URL" name="soundcloud_url" value={form.soundcloud_url}
          onChange={setField} placeholder="https://soundcloud.com/..." />
        <FormField label="Instagram URL" name="instagram_url" value={form.instagram_url}
          onChange={setField} placeholder="https://instagram.com/..." />
        <FormField label="Telegram URL" name="telegram_url" value={form.telegram_url}
          onChange={setField} placeholder="https://t.me/..." />

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
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => navigate('/admin/artists')}>
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
