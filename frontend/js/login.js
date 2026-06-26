document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Logging in…';

    try {
      const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
      setSession(data.token, data.user);

      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      window.location.href = next && next.endsWith('.html') ? next : 'index.html';
    } catch (err) {
      showAlert(err.message);
      btn.disabled = false;
      btn.textContent = 'Log in';
    }
  });
});

function showAlert(message) {
  const box = document.getElementById('form-alert');
  box.textContent = message;
  box.className = 'alert alert-error';
  box.classList.remove('hidden');
}

function clearAlert() {
  document.getElementById('form-alert').classList.add('hidden');
}
