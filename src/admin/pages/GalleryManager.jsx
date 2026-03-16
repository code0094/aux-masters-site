import React, { useState, useEffect, useRef } from 'react';
import { getGallery, uploadPhoto, deletePhoto } from '../api';
import Confirm from '../components/Confirm';

export default function GalleryManager({ showToast }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const fileRef = useRef();

  const load = () => {
    getGallery()
      .then(setImages)
      .catch(e => showToast(e.message, true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    let success = 0;
    for (const file of files) {
      try {
        await uploadPhoto(file);
        success++;
      } catch (err) {
        showToast(`Ошибка: ${file.name}`, true);
      }
    }
    if (success > 0) {
      showToast(`Загружено: ${success} фото`);
    }
    setUploading(false);
    load();
    // Reset input
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = (img) => {
    setConfirm({
      title: 'Удалить фото?',
      message: img.alt || 'Фото',
      onConfirm: async () => {
        try {
          await deletePhoto(img.id);
          showToast('Фото удалено');
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
      <h1 className="admin-page-title">Галерея ({images.length})</h1>

      <div className="admin-gallery-grid">
        {/* Upload cell */}
        <label className="admin-gallery-upload" style={uploading ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
          <span>{uploading ? '⏳' : '+'}</span>
          <span>{uploading ? 'Загрузка...' : 'Загрузить'}</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
        </label>

        {images.map(img => (
          <div key={img.id} className="admin-gallery-item">
            <img src={img.src} alt={img.alt} loading="lazy" />
            <div className="admin-gallery-item-overlay" onClick={() => handleDelete(img)}>
              <button className="admin-btn admin-btn--danger admin-btn--small">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && !uploading && (
        <div className="admin-empty" style={{ marginTop: 20 }}>
          <div className="admin-empty-icon">▣</div>
          <p>Нет фото</p>
        </div>
      )}

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
