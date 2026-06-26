const state = {
  year: '',
  branch: '',
  type: '',
  subject: '',
  page: 1
};

let YEARS_CACHE = [];
let BRANCHES_CACHE = [];
let TYPES_CACHE = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadMetaAndBuildFilters();
  bindFilterEvents();
  loadNotes();
});

async function loadMetaAndBuildFilters() {
  try {
    const meta = await apiFetch('/meta');
    YEARS_CACHE = meta.years;
    BRANCHES_CACHE = meta.branches;
    TYPES_CACHE = meta.types;

    const yearTabs = document.getElementById('year-tabs');
    yearTabs.innerHTML =
      `<button class="year-tab is-active" data-year="">All years</button>` +
      meta.years.map((y) => `<button class="year-tab" data-year="${escapeHtml(y)}">${escapeHtml(y)}</button>`).join('');

    const branchSelect = document.getElementById('branch-select');
    branchSelect.innerHTML =
      `<option value="">All branches</option>` +
      meta.branches.map((b) => `<option value="${b.code}">${escapeHtml(b.label)}</option>`).join('');

    const typeSelect = document.getElementById('type-select');
    typeSelect.innerHTML =
      `<option value="">All types</option>` +
      meta.types.map((t) => `<option value="${t.code}">${escapeHtml(t.label)}</option>`).join('');
  } catch (err) {
    console.error('Failed to load filters', err);
  }
}

function bindFilterEvents() {
  document.getElementById('year-tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.year-tab');
    if (!btn) return;
    document.querySelectorAll('.year-tab').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    state.year = btn.dataset.year;
    state.page = 1;
    loadNotes();
  });

  document.getElementById('branch-select').addEventListener('change', (e) => {
    state.branch = e.target.value;
    state.page = 1;
    loadNotes();
  });

  document.getElementById('type-select').addEventListener('change', (e) => {
    state.type = e.target.value;
    state.page = 1;
    loadNotes();
  });

  let searchTimer;
  document.getElementById('subject-search').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const value = e.target.value;
    searchTimer = setTimeout(() => {
      state.subject = value;
      state.page = 1;
      loadNotes();
    }, 350);
  });
}

async function loadNotes() {
  const grid = document.getElementById('notes-grid');
  const resultsCount = document.getElementById('results-count');
  grid.innerHTML = `<p style="color:var(--ink-soft);font-family:var(--font-mono);font-size:13px;">Loading…</p>`;

  const params = new URLSearchParams();
  if (state.year) params.set('year', state.year);
  if (state.branch) params.set('branch', state.branch);
  if (state.type) params.set('type', state.type);
  if (state.subject) params.set('subject', state.subject);
  params.set('page', state.page);
  params.set('limit', 18);

  try {
    const data = await apiFetch(`/notes?${params.toString()}`);
    renderNotes(data.notes);
    resultsCount.textContent = `${data.total} file${data.total === 1 ? '' : 's'} found`;
    renderPagination(data.page, data.totalPages);
  } catch (err) {
    grid.innerHTML = `<p class="alert alert-error">Could not load notes: ${escapeHtml(err.message)}</p>`;
  }
}

function renderNotes(notes) {
  const grid = document.getElementById('notes-grid');

  if (!notes.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state__title">No files here yet</div>
        <p>Be the first to upload notes for this year/branch.</p>
      </div>`;
    return;
  }

  const user = getUser();

  grid.innerHTML = notes
    .map((note) => {
      const branchLabel = (BRANCHES_CACHE.find((b) => b.code === note.branch) || {}).label || note.branch;
      const typeLabel = (TYPES_CACHE.find((t) => t.code === note.type) || {}).label || note.type;
      const callNumber = `${note.branch.toUpperCase()}-${note.year.replace(' Year', '')}-${note.type.toUpperCase()}`;
      const canDelete = user && (user.id === note.uploadedBy || user.role === 'admin');
      const uploadedDate = new Date(note.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      return `
        <article class="note-card">
          <span class="stamp stamp--${note.type}">${escapeHtml(typeLabel)}</span>
          <div class="note-card__callnumber">${escapeHtml(callNumber)} · ${escapeHtml(branchLabel)} · ${escapeHtml(note.year)}</div>
          <h3 class="note-card__title">${escapeHtml(note.title)}</h3>
          <div class="note-card__subject">${escapeHtml(note.subject)}</div>
          ${note.description ? `<div class="note-card__desc">${escapeHtml(note.description)}</div>` : ''}
          <div class="note-card__meta">
            <span>by ${escapeHtml(note.uploaderName)} · ${uploadedDate}</span>
            <span>${note.downloads} dl</span>
          </div>
          <div class="note-card__actions">
            <a class="btn btn-accent btn-sm" href="${API_BASE}/notes/${note._id}/download">Download</a>
            ${canDelete ? `<button class="btn btn-danger btn-sm" data-delete-id="${note._id}">Delete</button>` : ''}
          </div>
        </article>
      `;
    })
    .join('');

  grid.querySelectorAll('[data-delete-id]').forEach((btn) => {
    btn.addEventListener('click', () => handleDelete(btn.dataset.deleteId));
  });
}

async function handleDelete(noteId) {
  if (!confirm('Delete this file? This cannot be undone.')) return;
  try {
    await apiFetch(`/notes/${noteId}`, { method: 'DELETE' });
    loadNotes();
  } catch (err) {
    alert(`Could not delete: ${err.message}`);
  }
}

function renderPagination(page, totalPages) {
  const el = document.getElementById('pagination');
  if (totalPages <= 1) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML = `
    <button class="btn btn-ghost btn-sm" id="prev-page" ${page <= 1 ? 'disabled' : ''}>← Prev</button>
    <span>Page ${page} of ${totalPages}</span>
    <button class="btn btn-ghost btn-sm" id="next-page" ${page >= totalPages ? 'disabled' : ''}>Next →</button>
  `;
  const prev = document.getElementById('prev-page');
  const next = document.getElementById('next-page');
  if (prev) prev.addEventListener('click', () => { state.page -= 1; loadNotes(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  if (next) next.addEventListener('click', () => { state.page += 1; loadNotes(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
}
