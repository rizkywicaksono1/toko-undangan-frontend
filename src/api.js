// api.js — helper untuk memanggil backend Express
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getToken() {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const headers = { 'Content-TAype': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const err = new Error(
      (data && (data.error || data.message)) || 'Terjadi kesalahan, silakan coba lagi.'
    );
    err.status = res.status;
    err.data = data;
    // Kompatibel dengan gaya axios: err.response.data.message
    err.response = { status: res.status, data };
    throw err;
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
};

// Default export supaya `import api from "../api"` dan `import { api } from "../api"` sama-sama jalan
export default api;
