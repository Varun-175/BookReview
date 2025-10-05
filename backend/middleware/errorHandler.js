export const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  // Normalize status and code
  const status = Number(err.status || res.statusCode || 500);
  res.status(status);

  // Basic mapping (optional)
  const code =
    err.code ||
    (status === 400 ? 'BAD_REQUEST' :
     status === 401 ? 'UNAUTHORIZED' :
     status === 403 ? 'FORBIDDEN' :
     status === 404 ? 'NOT_FOUND' :
     status === 409 ? 'CONFLICT' :
     'SERVER_ERROR');

  const payload = {
    message: err.message || 'Server error',
    code
  };

  // Include stack only in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    payload.stack = err.stack;
  }

  // Optional: include a request id if you add one earlier in the middleware chain
  if (req.id) payload.requestId = req.id;

  res.json(payload);
};
