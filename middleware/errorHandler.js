exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.statusCode || 500;

  const errorResponse = {
    error: err.message || 'Something went wrong',
  };

  res.status(status).json(errorResponse);
};



exports.notFoundErrorHandler = (req, res, next) => {
  res.status(404).json({ error: 'Resource Not Found' });
};
