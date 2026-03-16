import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNav from './components/AdminNav';
import Dashboard from './pages/Dashboard';
import ArtistsList from './pages/ArtistsList';
import ArtistForm from './pages/ArtistForm';
import EventsList from './pages/EventsList';
import EventForm from './pages/EventForm';
import GalleryManager from './pages/GalleryManager';
import MixesList from './pages/MixesList';
import MixForm from './pages/MixForm';
import Messages from './pages/Messages';
import Admins from './pages/Admins';
import { getStats } from './api';
import './Admin.css';

export default function AdminApp() {
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState(null);

  // Initialize Telegram WebApp
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      // Apply Telegram theme
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams?.bg_color || '#1a1a1a');
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams?.text_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams?.hint_color || '#999999');
      document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams?.link_color || '#ff3d00');
      document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams?.button_color || '#ff3d00');
      document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams?.button_text_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams?.secondary_bg_color || '#111111');
    }
  }, []);

  // Fetch unread count
  const refreshUnread = useCallback(() => {
    getStats()
      .then(s => setUnread(s.unread || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshUnread();
  }, [refreshUnread]);

  // Toast helper
  const showToast = useCallback((message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <div className="admin-app">
      {toast && (
        <div className={`admin-toast${toast.isError ? ' admin-toast--error' : ''}`}>
          {toast.message}
        </div>
      )}

      <Routes>
        <Route index element={<Dashboard showToast={showToast} />} />
        <Route path="artists" element={<ArtistsList showToast={showToast} />} />
        <Route path="artists/new" element={<ArtistForm showToast={showToast} />} />
        <Route path="artists/:slug/edit" element={<ArtistForm showToast={showToast} />} />
        <Route path="events" element={<EventsList showToast={showToast} />} />
        <Route path="events/new" element={<EventForm showToast={showToast} />} />
        <Route path="events/:id/edit" element={<EventForm showToast={showToast} />} />
        <Route path="gallery" element={<GalleryManager showToast={showToast} />} />
        <Route path="mixes" element={<MixesList showToast={showToast} />} />
        <Route path="mixes/new" element={<MixForm showToast={showToast} />} />
        <Route path="mixes/:id/edit" element={<MixForm showToast={showToast} />} />
        <Route path="messages" element={<Messages showToast={showToast} onRead={refreshUnread} />} />
        <Route path="admins" element={<Admins showToast={showToast} />} />
      </Routes>

      <AdminNav unread={unread} />
    </div>
  );
}
