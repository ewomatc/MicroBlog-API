app.use(function (err, req, res, next) {
  console.error(err.stack);

  // Determine the status code based on the error or default to 500 (Internal Server Error)
  const status = err.statusCode || 500;

  // Construct a more informative error response
  const errorResponse = {
    error: err.message || 'Something went wrong', // Use the error message if available
  };

  // Include additional error details if available (e.g., stack trace)
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    errorResponse.details = err.stack;
  }

  res.status(status).json(errorResponse);
});
