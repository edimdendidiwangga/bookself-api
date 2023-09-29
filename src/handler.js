const { nanoid } = require('nanoid');
const books = require('./books');

// Create an API response object
const createApiResponse = (status, message, data = null) => ({
  status,
  message,
  ...(data !== null && { data }),
});

// Add a new book to the library
const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Validate input
  if (!name) {
    return h.response(createApiResponse('fail', 'Gagal menambahkan buku. Mohon isi nama buku')).code(400);
  }

  if (readPage > pageCount) {
    return h.response(createApiResponse('fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount')).code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.some((book) => book.id === id);

  if (isSuccess) {
    return h
      .response(createApiResponse('success', 'Buku berhasil ditambahkan', { bookId: id }))
      .code(201);
  }

  return h.response(createApiResponse('error', 'Buku gagal ditambahkan')).code(500);
};

// Get a list of all books
const getAllBooks = (request, h) => {
  const listBooks = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response(createApiResponse('success', 'Books retrieved successfully', { books: listBooks })).code(200);
};

// Get a book by its ID
const getBookById = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((n) => n.id === bookId);

  if (book) {
    return h.response(createApiResponse('success', 'Book retrieved successfully', { book })).code(200);
  }

  return h.response(createApiResponse('fail', 'Buku tidak ditemukan')).code(404);
};

// Edit a book by its ID
const editBookById = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  // Validate input
  if (!name) {
    return h.response(createApiResponse('fail', 'Gagal memperbarui buku. Mohon isi nama buku')).code(400);
  }

  if (readPage > pageCount) {
    return h.response(createApiResponse('fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount')).code(400);
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return h.response(createApiResponse('success', 'Buku berhasil diperbarui')).code(200);
  }

  return h.response(createApiResponse('fail', 'Gagal memperbarui buku. Id tidak ditemukan')).code(404);
};

// Delete a book by its ID
const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response(createApiResponse('success', 'Buku berhasil dihapus')).code(200);
  }

  return h.response(createApiResponse('fail', 'Gagal menghapus buku. Id tidak ditemukan')).code(404);
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
