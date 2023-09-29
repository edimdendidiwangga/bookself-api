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
    return h.response(createApiResponse('fail', 'Failed to add a book. Please provide the book name')).code(400);
  }

  if (readPage > pageCount) {
    return h.response(createApiResponse('fail', 'Failed to add a book. The readPage cannot be greater than pageCount')).code(400);
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
      .response(createApiResponse('success', 'Book added successfully', { bookId: id }))
      .code(201);
  }

  return h.response(createApiResponse('error', 'Failed to add the book')).code(500);
};

// Get a list of all books with optional filters
const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = [...books];

  // Helper function to filter by a property
  const filterByProperty = (arr, property, searchTerm) => {
    const searchTermLower = searchTerm.toLowerCase();
    return arr.filter((item) => item[property].toLowerCase().includes(searchTermLower));
  };

  if (name) {
    filteredBooks = filterByProperty(filteredBooks, 'name', name);
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => Number(book.reading) === Number(reading));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => Number(book.finished) === Number(finished));
  }

  // Return a simplified list of books
  const listBooks = filteredBooks.map((book) => ({
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

  return h.response(createApiResponse('fail', 'Book not found')).code(404);
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
    return h.response(createApiResponse('fail', 'Failed to update the book. Please provide the book name')).code(400);
  }

  if (readPage > pageCount) {
    return h.response(createApiResponse('fail', 'Failed to update the book. The readPage cannot be greater than pageCount')).code(400);
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

    return h.response(createApiResponse('success', 'Book updated successfully')).code(200);
  }

  return h.response(createApiResponse('fail', 'Failed to update the book. Id not found')).code(404);
};

// Delete a book by its ID
const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response(createApiResponse('success', 'Book deleted successfully')).code(200);
  }

  return h.response(createApiResponse('fail', 'Failed to delete the book. Id not found')).code(404);
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
