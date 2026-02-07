const notFound = (req, res, next) => {
  const err = new Error(` Page Not Found - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = notFound;
