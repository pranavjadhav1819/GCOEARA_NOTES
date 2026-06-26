const AUTH_TOKEN_KEY = 'gcoerak_token';
const AUTH_USER_KEY = 'gcoerak_user';

function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function getUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function isLoggedIn() {
  return Boolean(getToken());
}

function setSession(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

function logout() {
  clearSession();
  window.location.href = 'index.html';
}

// Call at the top of pages that require login (e.g. upload.html)
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = `login.html?next=${encodeURIComponent(window.location.pathname.split('/').pop())}`;
  }
}
