const AUTH_TOKEN_KEY = 'gcoerak_token';
const AUTH_USER_KEY  = 'gcoerak_user';

/* ── Session helpers ─────────────────────────────────────────── */
function getToken()  { return localStorage.getItem(AUTH_TOKEN_KEY); }
function getUser()   { const r = localStorage.getItem(AUTH_USER_KEY); return r ? JSON.parse(r) : null; }
function isLoggedIn(){ return Boolean(getToken()); }

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

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = `login.html?next=${encodeURIComponent(window.location.pathname.split('/').pop())}`;
  }
}

/* ── Supabase client (for Google OAuth only) ─────────────────── */
let _supabaseClient = null;

function getSupabaseClient() {
  if (!_supabaseClient && typeof supabase !== 'undefined') {
    _supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabaseClient;
}

/* ── Google Sign-In ──────────────────────────────────────────── */
async function signInWithGoogle() {
  const client = getSupabaseClient();
  if (!client) { alert('Google sign-in unavailable.'); return; }

  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/index.html'
    }
  });

  if (error) alert('Google sign-in failed: ' + error.message);
}

/* ── Handle Google OAuth callback ───────────────────────────── */
async function handleGoogleCallback() {
  if (isLoggedIn()) return;                      // already logged in
  if (typeof supabase === 'undefined') return;   // supabase not loaded

  const client = getSupabaseClient();
  if (!client) return;

  const { data: { session }, error } = await client.auth.getSession();
  if (error || !session) return;

  try {
    // Exchange Supabase token for our own JWT
    const data = await apiFetch('/auth/google', {
      method: 'POST',
      body: { access_token: session.access_token }
    });

    setSession(data.token, data.user);

    // Sign out from Supabase — we use our own JWT from here on
    await client.auth.signOut();

    // Redirect to home
    window.location.href = 'index.html';
  } catch (err) {
    console.error('Google auth exchange failed:', err.message);
  }
}

// Run on every page load to catch the OAuth redirect
document.addEventListener('DOMContentLoaded', handleGoogleCallback);
