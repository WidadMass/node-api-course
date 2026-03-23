const API = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (res) => {
  const data = res.status !== 204 ? await res.json() : null;
  if (!res.ok) throw new Error(data?.error || data?.message || 'Erreur serveur');
  return data;
};

export const auth = {
  register: (body) =>
    fetch(`${API}/auth/register`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  login: (body) =>
    fetch(`${API}/auth/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  me: () =>
    fetch(`${API}/auth/me`, { headers: getHeaders() }).then(handleResponse),
};

export const livres = {
  getAll: () =>
    fetch(`${API}/livres`).then(handleResponse),
  getById: (id) =>
    fetch(`${API}/livres/${id}`).then(handleResponse),
  create: (body) =>
    fetch(`${API}/livres`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  update: (id, body) =>
    fetch(`${API}/livres/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  remove: (id) =>
    fetch(`${API}/livres/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),
  emprunter: (id) =>
    fetch(`${API}/livres/${id}/emprunter`, { method: 'POST', headers: getHeaders() }).then(handleResponse),
  retourner: (id) =>
    fetch(`${API}/livres/${id}/retourner`, { method: 'POST', headers: getHeaders() }).then(handleResponse),
};
