/**
 * Creates an HTTP client with injectable token provider (Dependency Inversion Principle).
 * Enables testability and decoupling from localStorage.
 * @param {Object} options
 * @param {string} [options.baseUrl='/api'] - API base URL
 * @param {() => string|null} [options.getToken] - Token provider (defaults to localStorage)
 */
export function createHttpClient({ baseUrl = '/api', getToken } = {}) {
  const tokenProvider = getToken ?? (() => localStorage.getItem('auth_token'));

  async function request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = tokenProvider();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${baseUrl}${path}`, opts);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(data.error || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  return {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    patch: (path, body) => request('PATCH', path, body),
    delete: (path) => request('DELETE', path),
  };
}
