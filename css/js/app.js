// ─── App Entry Point & Book Rendering ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initTheme();
});

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  toggle.textContent = saved === 'dark' ? '☀️' : '🌙';

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

function renderBooks(results, query = '') {
  const grid = document.getElementById('booksGrid');
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

    return `
      <article class="book-card" onclick="openModal(${book.id})" role="button" tabindex="0"
               onkeydown="if(event.key==='Enter')openModal(${book.id})"
               aria-label="${book.title} by ${book.author}">
        <div class="book-cover" style="background: ${color}">
          <span class="book-initials">${initials}</span>
          <div class="book-badge ${book.available ? 'available' : 'unavailable'}">
            ${book.available ? '✓ Available' : '✗ Checked Out'}
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
    'Classic Fiction':      'linear-gradient(135deg, #667eea, #764ba2)',
    'Dystopian Fiction':    'linear-gradient(135deg, #f093fb, #f5576c)',
    'Romance':              'linear-gradient(135deg, #ff9a9e, #fecfef)',
    'Literary Fiction':     'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    'Fantasy':              'linear-gradient(135deg, #4facfe, #00f2fe)',
    'Science Fiction':      'linear-gradient(135deg, #43e97b, #38f9d7)',
    'Philosophical Fiction':'linear-gradient(135deg, #fa709a, #fee140)',
    'Psychological Fiction':'linear-gradient(135deg, #30cfd0, #667eea)',
    'Post-Apocalyptic':     'linear-gradient(135deg, #f7971e, #ffd200)',
    'Non-Fiction':          'linear-gradient(135deg, #89f7fe, #66a6ff)',
    'Memoir':               'linear-gradient(135deg, #fddb92, #d1fdff)',
  };
  return palette[genre] || 'linear-gradient(135deg, #868f96, #596164)';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function openModal(id) {
  const book  = books.find(b => b.id === id);
  if (!book) return;

  document.getElementById('modalTitle').textContent       = book.title;
  document.getElementById('modalAuthor').textContent      = `by ${book.author}`;
  document.getElementById('modalGenre').textContent       = book.genre;
  document.getElementById('modalYear').textContent        = book.year;
  document.getElementById('modalISBN').textContent        = book.isbn;
  document.getElementById('modalRating').textContent      = `${book.rating} / 5`;
  document.getElementById('modalDescription').textContent = book.description;
  document.getElementById('modalStars').innerHTML         = renderStars(book.rating);

  const statusEl = document.getElementById('modalStatus');
  statusEl.textContent = book.available ? '✓ Available' : '✗ Currently Checked Out';
  statusEl.className   = `modal-status ${book.available ? 'available' : 'unavailable'}`;

  const coverEl  = document.getElementById('modalCover');
  coverEl.style.background = genreColor(book.genre);
  coverEl.textContent      = getInitials(book.title);

  const borrowBtn = document.getElementById('borrowBtn');
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
  const btn = document.getElementById('borrowBtn');
  const action = book.available ? 'borrowed' : 'added to waitlist for';
  btn.textContent = `✓ ${book.available ? 'Borrowed!' : 'Waitlisted!'}`;
  btn.disabled    = true;
  setTimeout(() => {
    showToast(`You have ${action} "${book.title}"`);
    closeModal();
  }, 600);
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─── Keyboard & Overlay Close ─────────────────────────────────────────────────

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});