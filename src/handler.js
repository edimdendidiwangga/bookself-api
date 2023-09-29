const { nanoid } = require('nanoid');
const books = require('./books');

const createApiResponse = (status, message, data = null) => ({
  status,
  message,
  ...(data !== null && { data }),
});

const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

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
    return h.response(createApiResponse('success', 'Buku berhasil ditambahkan', { bookId: id })).code(201);
  }

  return h.response(createApiResponse('error', 'Buku gagal ditambahkan')).code(500);
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = [...books];

  if (name) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => Number(book.reading) === Number(reading));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => Number(book.finished) === Number(finished));
  }

  const listBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response(createApiResponse('success', 'Books retrieved successfully', { books: listBooks })).code(200);
};

const getBookById = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((n) => n.id === bookId);

  if (book) {
    return h.response(createApiResponse('success', 'Book retrieved successfully', { book })).code(200);
  }

  return h.response(createApiResponse('fail', 'Buku tidak ditemukan')).code(404);
};

const editBookById = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

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

const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response(createApiResponse('success', 'Buku berhasil dihapus')).code(200);
  }

  return h.response(createApiResponse('fail', 'Buku gagal dihapus. Id tidak ditemukan')).code(404);
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
