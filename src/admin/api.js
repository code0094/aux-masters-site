/**
 * Admin API client — sends X-Telegram-Init-Data header.
 */

const BASE = '/api/admin';

function getInitData() {
  // In Telegram WebApp — real initData
  if (window.Telegram?.WebApp?.initData) {
    return window.Telegram.WebApp.initData;
  }
  // Dev mode fallback
  return 'dev';
}

async function request(path, options = {}) {
  const headers = {
    'X-Telegram-Init-Data': getInitData(),
    ...options.headers,
  };

  // Don't set Content-Type for FormData (browser sets boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json();
}

// ── Stats ──────────────────────────────
export function getStats() {
  return request('/stats');
}

// ── Artists ────────────────────────────
export function getArtists() {
  return request('/artists');
}
export function createArtist(data) {
  return request('/artists', { method: 'POST', body: JSON.stringify(data) });
}
export function updateArtist(slug, data) {
  return request(`/artists/${slug}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteArtist(slug) {
  return request(`/artists/${slug}`, { method: 'DELETE' });
}

// ── Events ─────────────────────────────
export function getEvents() {
  return request('/events');
}
export function createEvent(data) {
  return request('/events', { method: 'POST', body: JSON.stringify(data) });
}
export function updateEvent(id, data) {
  return request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteEvent(id) {
  return request(`/events/${id}`, { method: 'DELETE' });
}

// ── Mixes ──────────────────────────────
export function getMixes() {
  return request('/mixes');
}
export function createMix(data) {
  return request('/mixes', { method: 'POST', body: JSON.stringify(data) });
}
export function updateMix(id, data) {
  return request(`/mixes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteMix(id) {
  return request(`/mixes/${id}`, { method: 'DELETE' });
}

// ── Gallery ────────────────────────────
export function getGallery() {
  return request('/gallery');
}
export function uploadPhoto(file) {
  const form = new FormData();
  form.append('file', file);
  return request('/gallery', { method: 'POST', body: form });
}
export function deletePhoto(id) {
  return request(`/gallery/${id}`, { method: 'DELETE' });
}

// ── Messages ───────────────────────────
export function getMessages() {
  return request('/messages');
}
export function markMessageRead(id) {
  return request(`/messages/${id}/read`, { method: 'PATCH' });
}

// ── Admins ─────────────────────────────
export function getAdmins() {
  return request('/admins');
}
export function addAdmin(telegramId) {
  return request('/admins', { method: 'POST', body: JSON.stringify({ telegramId }) });
}
export function removeAdmin(telegramId) {
  return request(`/admins/${telegramId}`, { method: 'DELETE' });
}
