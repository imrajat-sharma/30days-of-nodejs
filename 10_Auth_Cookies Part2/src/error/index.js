function errorHandler(err, req, res, next) {
  console.error(process.env.ENV === "production" ? "OK" : err.stack);
  res.status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error" });
}

module.exports = errorHandler;