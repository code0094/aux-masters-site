import React, { useState, useEffect } from 'react';
import { getGallery } from '../api/client';
import '../styles/Pages.css';

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getGallery().then(setGalleryImages).catch(console.error);
  }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-content">
          <h1 className="page-hero-title">ГАЛЕРЕЯ</h1>
          <p className="page-hero-subtitle">МОМЕНТЫ С ТАНЦПОЛА</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="page-section">
        <div className="page-container" style={{ maxWidth: '1400px' }}>
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div 
                key={image.id}
                className={`gallery-item ${index % 3 === 0 ? 'tall' : ''}`}
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="gallery-image"
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <span className="gallery-event">{image.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="gallery-note">
        <p className="gallery-note-text">
          Есть фото с наших мероприятий? Отмечай нас в социальных сетях
        </p>
        <div className="gallery-social-tags">
          <span className="gallery-social-tag">@auxmasters</span>
          <span className="gallery-social-tag">#auxmasters</span>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
            ✕
          </button>
          <img 
            src={selectedImage.src} 
            alt={selectedImage.alt}
            className="lightbox-image"
          />
          <span className="lightbox-caption">{selectedImage.event}</span>
        </div>
      )}
    </div>
  );
}
