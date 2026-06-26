document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();
  await populateDropdowns();
  bindDropzone();
  bindSubmit();
});

async function populateDropdowns() {
  try {
    const meta = await apiFetch('/meta');

    const yearSelect = document.getElementById('note-year');
    yearSelect.innerHTML = meta.years.map((y) => `<option value="${escapeHtml(y)}">${escapeHtml(y)}</option>`).join('');

    const branchSelect = document.getElementById('note-branch');
    branchSelect.innerHTML = meta.branches.map((b) => `<option value="${b.code}">${escapeHtml(b.label)}</option>`).join('');

    const typeSelect = document.getElementById('note-type');
    typeSelect.innerHTML = meta.types.map((t) => `<option value="${t.code}">${escapeHtml(t.label)}</option>`).join('');

    // Pre-select the uploader's own branch/year if they set it at registration
    const user = getUser();
    if (user?.branch) branchSelect.value = user.branch;
    if (user?.year) yearSelect.value = user.year;
  } catch (err) {
    showAlert(err.message);
  }
}

function bindDropzone() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('note-file');
  const chip = document.getElementById('file-chip');

  dropzone.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    })
  );

  ['dragleave', 'drop'].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
    })
  );

  dropzone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) {
      fileInput.files = e.dataTransfer.files;
      updateFileChip(file);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) updateFileChip(fileInput.files[0]);
  });

  function updateFileChip(file) {
    const sizeKb = (file.size / 1024).toFixed(0);
    chip.textContent = `📎 ${file.name} (${sizeKb} KB)`;
    chip.classList.remove('hidden');
  }
}

function bindSubmit() {
  const form = document.getElementById('upload-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const fileInput = document.getElementById('note-file');
    if (!fileInput.files[0]) {
      showAlert('Please attach a file (PDF, Word, PPT or image).');
      return;
    }

    const submitBtn = document.getElementById('upload-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading…';

    const formData = new FormData();
    formData.append('title', document.getElementById('note-title').value.trim());
    formData.append('subject', document.getElementById('note-subject').value.trim());
    formData.append('description', document.getElementById('note-description').value.trim());
    formData.append('year', document.getElementById('note-year').value);
    formData.append('branch', document.getElementById('note-branch').value);
    formData.append('type', document.getElementById('note-type').value);
    formData.append('file', fileInput.files[0]);

    try {
      await apiFetch('/notes', { method: 'POST', body: formData, isFormData: true });
      showAlert('Uploaded successfully. Redirecting to the catalog…', 'success');
      setTimeout(() => (window.location.href = 'index.html'), 1200);
    } catch (err) {
      showAlert(err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Upload file';
    }
  });
}

function showAlert(message, type = 'error') {
  const box = document.getElementById('form-alert');
  box.textContent = message;
  box.className = `alert alert-${type}`;
  box.classList.remove('hidden');
}

function clearAlert() {
  const box = document.getElementById('form-alert');
  box.classList.add('hidden');
}
