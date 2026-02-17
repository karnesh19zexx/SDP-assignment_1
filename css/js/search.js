// ─── Search & Filter Engine ───────────────────────────────────────────────────

let currentQuery = '';
let currentGenre = 'all';
let currentAvailability = 'all';
let currentSort = 'title';
let searchTimeout = null;

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const genreFilter = document.getElementById('genreFilter');
  const availabilityFilter = document.getElementById('availabilityFilter');
  const sortSelect = document.getElementById('sortSelect');
  const clearBtn = document.getElementById('clearSearch');

  // Populate genre filter dynamically
  const genres = [...new Set(books.map(b => b.genre))].sort();
  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });

  // Live search with debounce
  searchInput.addEventListener('input', (e) => {
    currentQuery = e.target.value.trim();
    clearBtn.classList.toggle('visible', currentQuery.length > 0);
    debounceSearch();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearSearch();
    }
  });

  genreFilter.addEventListener('change', (e) => {
    currentGenre = e.target.value;
    performSearch();
  });

  availabilityFilter.addEventListener('change', (e) => {
    currentAvailability = e.target.value;
    performSearch();
  });

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    performSearch();
  });

  clearBtn.addEventListener('click', clearSearch);

  // Initial render
  performSearch();
}

function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(performSearch, 250);
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('clearSearch').classList.remove('visible');
  currentQuery = '';
  performSearch();
}

function highlightText(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function performSearch() {
  const query = currentQuery.toLowerCase();

  let results = books.filter(book => {
    const matchesQuery =
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query) ||
      book.year.toString().includes(query);

    const matchesGenre =
      currentGenre === 'all' || book.genre === currentGenre;

    const matchesAvailability =
      currentAvailability === 'all' ||
      (currentAvailability === 'available' && book.available) ||
      (currentAvailability === 'unavailable' && !book.available);

    return matchesQuery && matchesGenre && matchesAvailability;
  });

  // Sort
  results.sort((a, b) => {
    switch (currentSort) {
      case 'title':     return a.title.localeCompare(b.title);
      case 'author':    return a.author.localeCompare(b.author);
      case 'year-asc':  return a.year - b.year;
      case 'year-desc': return b.year - a.year;
      case 'rating':    return b.rating - a.rating;
      default:          return 0;
    }
  });

  renderBooks(results, currentQuery);
  updateStats(results.length, books.length);
}

function updateStats(shown, total) {
  const statsEl = document.getElementById('resultsStats');
  if (currentQuery || currentGenre !== 'all' || currentAvailability !== 'all') {
    statsEl.textContent = `Showing ${shown} of ${total} books`;
    statsEl.classList.add('active');
  } else {
    statsEl.textContent = `${total} books in collection`;
    statsEl.classList.remove('active');
  }
}