document.addEventListener('DOMContentLoaded', async () => {
  if (isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  await populateDropdowns();

  const form = document.getElementById('register-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const branch = document.getElementById('reg-branch').value;
    const year = document.getElementById('reg-year').value;

    if (password.length < 6) {
      showAlert('Password must be at least 6 characters.');
      return;
    }

    const btn = document.getElementById('register-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Creating account…';

    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: { name, email, password, branch, year }
      });
      setSession(data.token, data.user);
      window.location.href = 'index.html';
    } catch (err) {
      showAlert(err.message);
      btn.disabled = false;
      btn.textContent = 'Create account';
    }
  });
});

async function populateDropdowns() {
  try {
    const meta = await apiFetch('/meta');
    document.getElementById('reg-branch').innerHTML =
      `<option value="">Prefer not to say</option>` +
      meta.branches.map((b) => `<option value="${b.code}">${escapeHtml(b.label)}</option>`).join('');
    document.getElementById('reg-year').innerHTML =
      `<option value="">Prefer not to say</option>` +
      meta.years.map((y) => `<option value="${escapeHtml(y)}">${escapeHtml(y)}</option>`).join('');
  } catch (err) {
    console.error(err);
  }
}

function showAlert(message) {
  const box = document.getElementById('form-alert');
  box.textContent = message;
  box.className = 'alert alert-error';
  box.classList.remove('hidden');
}

function clearAlert() {
  document.getElementById('form-alert').classList.add('hidden');
}
