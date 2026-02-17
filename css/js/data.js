const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Fiction",
    year: 1925,
    isbn: "9780743273565",
    available: true,
    rating: 4.2,
    description: "A story of decadence and excess, Gatsby explores the American Dream in the Roaring Twenties.",
    coverId: "8432498"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic Fiction",
    year: 1960,
    isbn: "9780061120084",
    available: true,
    rating: 4.8,
    description: "A profound novel about racial injustice and moral growth in the American South.",
    coverId: "8228691"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    year: 1949,
    isbn: "9780451524935",
    available: false,
    rating: 4.7,
    description: "A chilling prophecy depicting a totalitarian society under constant surveillance.",
    coverId: "8575708"
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    year: 1813,
    isbn: "9780141439518",
    available: true,
    rating: 4.5,
    description: "A witty exploration of marriage, social standing, and love in Regency-era England.",
    coverId: "8739161"
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Literary Fiction",
    year: 1951,
    isbn: "9780316769488",
    available: true,
    rating: 3.9,
    description: "A coming-of-age story following the rebellious Holden Caulfield through New York City.",
    coverId: "8231432"
  },
  {
    id: 6,
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Dystopian Fiction",
    year: 1932,
    isbn: "9780060850524",
    available: false,
    rating: 4.1,
    description: "A disturbing vision of a future society built on technological control and engineered happiness.",
    coverId: "8406786"
  },
  {
    id: 7,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    year: 1937,
    isbn: "9780547928227",
    available: true,
    rating: 4.7,
    description: "Bilbo Baggins embarks on an unexpected journey with thirteen dwarves and a wizard.",
    coverId: "12003858"
  },
  {
    id: 8,
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    year: 1997,
    isbn: "9780439708180",
    available: true,
    rating: 4.9,
    description: "A young boy discovers he's a wizard and begins his education at Hogwarts School.",
    coverId: "10110415"
  },
  {
    id: 9,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Philosophical Fiction",
    year: 1988,
    isbn: "9780062315007",
    available: true,
    rating: 4.3,
    description: "A shepherd's journey to find his personal legend and the treasure he seeks.",
    coverId: "8299516"
  },
  {
    id: 10,
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    genre: "Psychological Fiction",
    year: 1866,
    isbn: "9780140305142",
    available: false,
    rating: 4.4,
    description: "A psychological drama about a student who commits a crime and grapples with guilt.",
    coverId: "8945189"
  },
  {
    id: 11,
    title: "The Road",
    author: "Cormac McCarthy",
    genre: "Post-Apocalyptic",
    year: 2006,
    isbn: "9780307387899",
    available: true,
    rating: 4.2,
    description: "A father and son journey through a desolate, post-apocalyptic American landscape.",
    coverId: "7222246"
  },
  {
    id: 12,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "Non-Fiction",
    year: 2011,
    isbn: "9780062316097",
    available: true,
    rating: 4.4,
    description: "A sweeping narrative of human history from the Stone Age through the modern era.",
    coverId: "8758853"
  },
  {
    id: 13,
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    year: 1965,
    isbn: "9780441172719",
    available: false,
    rating: 4.6,
    description: "An epic tale of politics, religion, and survival on a desert planet.",
    coverId: "8351991"
  },
  {
    id: 14,
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    genre: "Science Fiction",
    year: 1979,
    isbn: "9780345391803",
    available: true,
    rating: 4.5,
    description: "A comedic science fiction adventure across the galaxy with an ordinary man and his alien friend.",
    coverId: "8691719"
  },
  {
    id: 15,
    title: "Educated",
    author: "Tara Westover",
    genre: "Memoir",
    year: 2018,
    isbn: "9780399590504",
    available: true,
    rating: 4.7,
    description: "A remarkable memoir of a woman who grew up in a survivalist family and forged her own path.",
    coverId: "8758851"
  },
  {
    id: 16,
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    year: 2007,
    isbn: "9780756404079",
    available: true,
    rating: 4.6,
    description: "The tale of Kvothe, a legendary wizard and hero, told in his own words.",
    coverId: "8373086"
  }
];

// Helper: get cover URL from Open Library
function getCoverUrl(book, size = 'M') {
  if (book.coverId) {
    return `https://covers.openlibrary.org/b/id/${book.coverId}-${size}.jpg`;
  }
  if (book.isbn) {
    return `https://covers.openlibrary.org/b/isbn/${book.isbn}-${size}.jpg`;
  }
  return null;
}

// Save/load user-added books from localStorage
function loadUserBooks() {
  try {
    const stored = localStorage.getItem('userBooks');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveUserBooks(userBooks) {
  localStorage.setItem('userBooks', JSON.stringify(userBooks));
}

function getAllBooks() {
  return [...books, ...loadUserBooks()];
}