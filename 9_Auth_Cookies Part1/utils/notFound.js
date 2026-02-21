const notFound = (req, res, next) => {
  if (req.path === "/favicon.ico") {
    return res.status(204).end();
  }
  const err = new Error(` Page Not Found - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = notFound;
