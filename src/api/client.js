const BASE = '/api';

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function getArtists() {
  return request('/artists/');
}

export async function getArtist(slug) {
  return request(`/artists/${slug}`);
}

export async function getEvents(status) {
  const q = status ? `?status=${status}` : '';
  return request(`/events/${q}`);
}

export async function getEvent(id) {
  return request(`/events/${id}`);
}

export async function getMixes() {
  return request('/mixes/');
}

export async function getGallery() {
  return request('/gallery/');
}

export async function sendContact(data) {
  const res = await fetch(`${BASE}/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}
