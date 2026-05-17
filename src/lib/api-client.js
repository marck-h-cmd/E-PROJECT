export class ApiClientError extends Error {
  constructor(message, code, status, details) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const res = await fetch('/api/auth/renovar-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const json = await res.json();

    if (!json.success || !json.data) return null;

    localStorage.setItem('accessToken', json.data.tokens.accessToken);
    localStorage.setItem('refreshToken', json.data.tokens.refreshToken);
    document.cookie = `auth_token=${json.data.tokens.accessToken}; path=/; max-age=86400; SameSite=Lax`;
    return json.data.tokens.accessToken;
  } catch {
    return null;
  }
}

function buildUrl(path, params) {
  const base = path.startsWith('http') ? path : path.startsWith('/') ? path : `/${path}`;
  if (!params) return base;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function apiRequest(path, options = {}) {
  const { params, body, skipAuth, headers: customHeaders, ...init } = options;
  const url = buildUrl(path, params);

  const headers = {
    ...customHeaders,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const requestBody =
    body === undefined
      ? undefined
      : body instanceof FormData
        ? body
        : JSON.stringify(body);

  let response = await fetch(url, {
    ...init,
    headers,
    body: requestBody,
  });

  if (response.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...init, headers, body: requestBody });
    }
  }

  return response.json();
}

export const apiPost = (path, body, options = {}) => 
  apiRequest(path, { ...options, method: 'POST', body });
export const apiGet = (path, params, options = {}) => 
  apiRequest(path, { ...options, method: 'GET', params });
export const apiPut = (path, body, options = {}) => 
  apiRequest(path, { ...options, method: 'PUT', body });
export const apiDelete = (path, options = {}) => 
  apiRequest(path, { ...options, method: 'DELETE' });
