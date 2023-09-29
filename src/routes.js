const {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
} = require('./handler');

const bookRoutes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookById,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookById,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookById,
  },
];

const rootRoute = {
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    // Handle the root route here if needed
    // For example, you can provide a welcome message
    return h.response('Welcome to the Book API').code(200);
  },
};

module.exports = [...bookRoutes, rootRoute];
