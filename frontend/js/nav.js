function renderNav() {
  const mount = document.getElementById('site-nav');
  if (!mount) return;

  const user = getUser();

  mount.innerHTML = `
    <header class="site-header">
      <div class="site-header__inner">
        <a class="brand" href="index.html">
          <span class="brand__eyebrow">GCOERAK · Awasari Kh., Pune</span>
          <span class="brand__title">Notes Catalog</span>
        </a>
        <nav class="nav-links">
          ${
            user
              ? `<span class="nav-user">Signed in as ${escapeHtml(user.name)}</span>
                 <a class="btn btn-accent btn-sm" href="upload.html">Upload</a>
                 <button class="btn btn-ghost btn-sm" id="nav-logout-btn">Log out</button>`
              : `<a class="btn btn-ghost btn-sm" href="login.html">Log in</a>
                 <a class="btn btn-primary btn-sm" href="register.html">Register</a>`
          }
        </nav>
      </div>
    </header>
  `;

  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', renderNav);
