// ─── App Entry Point ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initTheme();
  initAddBookModal();
});

// ─── Theme ────────────────────────────────────────────────────────────────────

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved  = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  toggle.textContent = saved === 'dark' ? '☀️' : '🌙';

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

// ─── Render Books ─────────────────────────────────────────────────────────────

function renderBooks(results, query = '') {
  const grid       = document.getElementById('booksGrid');
  const emptyState = document.getElementById('emptyState');

  if (results.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  grid.innerHTML = results.map(book => {
    const titleHL  = highlightText(escapeHtml(book.title), query);
    const authorHL = highlightText(escapeHtml(book.author), query);
    const stars    = renderStars(book.rating);
    const initials = getInitials(book.title);
    const color    = genreColor(book.genre);
    const coverUrl = getCoverUrl(book, 'M');

    const coverHTML = coverUrl
      ? `<img
           src="${coverUrl}"
           alt="Cover of ${escapeHtml(book.title)}"
           class="cover-img"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
           loading="lazy"
         />
         <span class="book-initials fallback" style="display:none">${initials}</span>`
      : `<span class="book-initials">${initials}</span>`;

    return `
      <article class="book-card" onclick="openModal(${book.id})" role="button" tabindex="0"
               onkeydown="if(event.key==='Enter')openModal(${book.id})"
               aria-label="${escapeHtml(book.title)} by ${escapeHtml(book.author)}">
        <div class="book-cover" style="background: ${color}">
          ${coverHTML}
          <div class="book-badge ${book.available ? 'available' : 'unavailable'}">
            ${book.available ? '✓ Available' : '✗ Out'}
          </div>
        </div>
        <div class="book-info">
          <span class="book-genre">${escapeHtml(book.genre)}</span>
          <h3 class="book-title">${titleHL}</h3>
          <p class="book-author">by ${authorHL}</p>
          <div class="book-meta">
            <span class="book-year">${book.year}</span>
            <div class="book-rating">
              ${stars}
              <span class="rating-num">${book.rating}</span>
            </div>
          </div>
        </div>
      </article>`;
  }).join('');
}

function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function getInitials(title) {
  return title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function genreColor(genre) {
  const palette = {
    'Classic Fiction':       'linear-gradient(135deg,#667eea,#764ba2)',
    'Dystopian Fiction':     'linear-gradient(135deg,#f093fb,#f5576c)',
    'Romance':               'linear-gradient(135deg,#ff9a9e,#fecfef)',
    'Literary Fiction':      'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    'Fantasy':               'linear-gradient(135deg,#4facfe,#00f2fe)',
    'Science Fiction':       'linear-gradient(135deg,#43e97b,#38f9d7)',
    'Philosophical Fiction': 'linear-gradient(135deg,#fa709a,#fee140)',
    'Psychological Fiction': 'linear-gradient(135deg,#30cfd0,#667eea)',
    'Post-Apocalyptic':      'linear-gradient(135deg,#f7971e,#ffd200)',
    'Non-Fiction':           'linear-gradient(135deg,#89f7fe,#66a6ff)',
    'Memoir':                'linear-gradient(135deg,#fddb92,#d1fdff)',
  };
  return palette[genre] || 'linear-gradient(135deg,#868f96,#596164)';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

// ─── Book Detail Modal ────────────────────────────────────────────────────────

function openModal(id) {
  const allBooks = getAllBooks();
  const book     = allBooks.find(b => b.id === id);
  if (!book) return;

  const coverUrl = getCoverUrl(book, 'L');
  const modalCoverEl = document.getElementById('modalCover');

  if (coverUrl) {
    modalCoverEl.innerHTML = `
      <img src="${coverUrl}" alt="Cover of ${escapeHtml(book.title)}"
           class="modal-cover-img"
           onerror="this.style.display='none'; document.getElementById('modalCoverFallback').style.display='flex';" />
      <div id="modalCoverFallback" class="modal-cover-fallback" style="display:none;background:${genreColor(book.genre)}">
        ${getInitials(book.title)}
      </div>`;
  } else {
    modalCoverEl.innerHTML = `
      <div id="modalCoverFallback" class="modal-cover-fallback" style="background:${genreColor(book.genre)}">
        ${getInitials(book.title)}
      </div>`;
  }

  document.getElementById('modalTitle').textContent       = book.title;
  document.getElementById('modalAuthor').textContent      = `by ${book.author}`;
  document.getElementById('modalGenre').textContent       = book.genre;
  document.getElementById('modalYear').textContent        = book.year;
  document.getElementById('modalISBN').textContent        = book.isbn || '—';
  document.getElementById('modalRating').textContent      = `${book.rating} / 5`;
  document.getElementById('modalDescription').textContent = book.description;
  document.getElementById('modalStars').innerHTML         = renderStars(book.rating);

  const statusEl   = document.getElementById('modalStatus');
  statusEl.textContent = book.available ? '✓ Available' : '✗ Currently Checked Out';
  statusEl.className   = `modal-status ${book.available ? 'available' : 'unavailable'}`;

  const borrowBtn  = document.getElementById('borrowBtn');
  borrowBtn.textContent = book.available ? 'Borrow Book' : 'Join Waitlist';
  borrowBtn.disabled    = false;
  borrowBtn.onclick     = () => handleBorrow(book);

  document.getElementById('bookModal').classList.remove('hidden');
  document.getElementById('bookModal').focus();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('bookModal').classList.add('hidden');
  document.body.style.overflow = '';
}

function handleBorrow(book) {
  const btn    = document.getElementById('borrowBtn');
  const action = book.available ? 'borrowed' : 'added to waitlist for';
  btn.textContent = `✓ ${book.available ? 'Borrowed!' : 'Waitlisted!'}`;
  btn.disabled    = true;
  setTimeout(() => {
    showToast(`You have ${action} "${book.title}"`);
    closeModal();
  }, 600);
}

// ─── Add Book Modal ───────────────────────────────────────────────────────────

function initAddBookModal() {
  document.getElementById('addBookBtn').addEventListener('click', openAddModal);
  document.getElementById('addBookForm').addEventListener('submit', handleAddBook);

  // Live ISBN/title preview
  const isbnInput  = document.getElementById('formISBN');
  const titleInput = document.getElementById('formTitle');

  let previewTimeout;
  function triggerPreview() {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(fetchCoverPreview, 700);
  }

  isbnInput.addEventListener('input', triggerPreview);
  titleInput.addEventListener('input', triggerPreview);
}

function openAddModal() {
  document.getElementById('addBookModal').classList.remove('hidden');
  document.getElementById('addBookForm').reset();
  resetCoverPreview();
  document.getElementById('formTitle').focus();
  document.body.style.overflow = 'hidden';
}

function closeAddModal() {
  document.getElementById('addBookModal').classList.add('hidden');
  document.body.style.overflow = '';
}

async function fetchCoverPreview() {
  const isbn  = document.getElementById('formISBN').value.trim().replace(/[-\s]/g, '');
  const title = document.getElementById('formTitle').value.trim();
  const preview = document.getElementById('coverPreview');
  const previewImg = document.getElementById('coverPreviewImg');
  const previewText = document.getElementById('coverPreviewText');

  let url = null;

  if (isbn.length >= 10) {
    url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  } else if (title.length >= 3) {
    // Try to find by title via Open Library search
    try {
      const res  = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1&fields=cover_i`);
      const data = await res.json();
      if (data.docs && data.docs[0] && data.docs[0].cover_i) {
        url = `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`;
        // Store cover ID for saving
        document.getElementById('formCoverId').value = data.docs[0].cover_i;
      }
    } catch { /* no cover found */ }
  }

  if (url) {
    previewImg.src = url;
    previewImg.onload = () => {
      // OL returns a 1x1 pixel if no cover found
      if (previewImg.naturalWidth < 5) {
        resetCoverPreview();
      } else {
        previewImg.classList.remove('hidden');
        previewText.classList.add('hidden');
      }
    };
    previewImg.onerror = resetCoverPreview;
  }
}

function resetCoverPreview() {
  const previewImg  = document.getElementById('coverPreviewImg');
  const previewText = document.getElementById('coverPreviewText');
  previewImg.classList.add('hidden');
  previewImg.src = '';
  previewText.classList.remove('hidden');
  document.getElementById('formCoverId').value = '';
}

async function handleAddBook(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('addBookSubmitBtn');
  submitBtn.textContent = 'Adding…';
  submitBtn.disabled    = true;

  const isbn    = document.getElementById('formISBN').value.trim().replace(/[-\s]/g, '');
  const coverId = document.getElementById('formCoverId').value.trim();
  const title   = document.getElementById('formTitle').value.trim();
  const rating  = parseFloat(document.getElementById('formRating').value) || 0;

  // If no coverId yet, try one more fetch by ISBN
  let finalCoverId = coverId;
  if (!finalCoverId && isbn) {
    try {
      const res  = await fetch(`https://openlibrary.org/search.json?isbn=${isbn}&limit=1&fields=cover_i`);
      const data = await res.json();
      if (data.docs && data.docs[0] && data.docs[0].cover_i) {
        finalCoverId = String(data.docs[0].cover_i);
      }
    } catch { /* skip */ }
  }

  const userBooks = loadUserBooks();
  const allBooks  = getAllBooks();
  const maxId     = allBooks.reduce((m, b) => Math.max(m, b.id), 0);

  const newBook = {
    id:          maxId + 1,
    title,
    author:      document.getElementById('formAuthor').value.trim(),
    genre:       document.getElementById('formGenre').value.trim(),
    year:        parseInt(document.getElementById('formYear').value) || new Date().getFullYear(),
    isbn:        isbn || null,
    available:   document.getElementById('formAvailable').value === 'true',
    rating:      Math.min(5, Math.max(0, rating)),
    description: document.getElementById('formDescription').value.trim(),
    coverId:     finalCoverId || null,
    userAdded:   true
  };

  userBooks.push(newBook);
  saveUserBooks(userBooks);

  // Refresh genre filter and results
  populateGenreFilter();
  performSearch();

  submitBtn.textContent = '✓ Book Added!';
  setTimeout(() => {
    closeAddModal();
    showToast(`"${newBook.title}" added to the library!`);
    submitBtn.textContent = 'Add to Library';
    submitBtn.disabled    = false;
  }, 700);
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─── Keyboard ─────────────────────────────────────────────────────────────────

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeAddModal();
  }
});