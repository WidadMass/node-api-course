const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const API = `${API_BASE}/api`;

// Token stocké en mémoire (plus sécurisé que localStorage)
let accessToken = null;

export const setToken = (token) => { accessToken = token; };
export const getToken = () => accessToken;
export const clearToken = () => { accessToken = null; };

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  return headers;
};

const handleResponse = async (res) => {
  const data = res.status !== 204 ? await res.json() : null;
  if (!res.ok) throw new Error(data?.error || data?.message || 'Erreur serveur');
  return data;
};

// Tente un refresh automatique si 401
const fetchWithRefresh = async (url, options = {}) => {
  let res = await fetch(url, { ...options, credentials: 'include' });

  if (res.status === 401 && accessToken) {
    // Essayer de rafraîchir le token
    const refreshRes = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      accessToken = data.accessToken;

      // Rejouer la requête avec le nouveau token
      const newHeaders = { ...options.headers };
      if (newHeaders['Authorization']) {
        newHeaders['Authorization'] = `Bearer ${accessToken}`;
      }
      res = await fetch(url, { ...options, headers: newHeaders, credentials: 'include' });
    } else {
      // Refresh échoué -> déconnexion
      accessToken = null;
      window.dispatchEvent(new Event('auth:logout'));
      throw new Error('Session expirée');
    }
  }

  return handleResponse(res);
};

export const auth = {
  register: (body) =>
    fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
      credentials: 'include'
    }).then(handleResponse),

  login: (body) =>
    fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
      credentials: 'include'
    }).then(handleResponse),

  me: () =>
    fetchWithRefresh(`${API}/auth/me`, { headers: getHeaders() }),

  refresh: () =>
    fetch(`${API}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    }).then(handleResponse),

  logout: () =>
    fetch(`${API}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    }).then(handleResponse),
};

export const livres = {
  getAll: () =>
    fetch(`${API}/livres`, { credentials: 'include' }).then(handleResponse),

  getById: (id) =>
    fetch(`${API}/livres/${id}`, { credentials: 'include' }).then(handleResponse),

  create: (body) =>
    fetchWithRefresh(`${API}/livres`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }),

  update: (id, body) =>
    fetchWithRefresh(`${API}/livres/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }),

  remove: (id) =>
    fetchWithRefresh(`${API}/livres/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }),

  emprunter: (id) =>
    fetchWithRefresh(`${API}/livres/${id}/emprunter`, {
      method: 'POST',
      headers: getHeaders()
    }),

  retourner: (id) =>
    fetchWithRefresh(`${API}/livres/${id}/retourner`, {
      method: 'POST',
      headers: getHeaders()
    }),
};
