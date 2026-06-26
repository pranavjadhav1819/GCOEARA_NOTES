/**
 * apiFetch(path, { method, body, isFormData })
 * - path: e.g. '/notes', '/auth/login'
 * - body: plain object (JSON) or FormData
 * Throws an Error with a readable message on non-2xx responses.
 */
async function apiFetch(path, { method = 'GET', body, isFormData = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let fetchBody;
  if (body !== undefined) {
    if (isFormData) {
      fetchBody = body; // browser sets the multipart Content-Type with boundary
    } else {
      headers['Content-Type'] = 'application/json';
      fetchBody = JSON.stringify(body);
    }
  }

  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: fetchBody });

  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const message = (data && data.message) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}
