function globalErrorHandler(err, req, res, next) {
  console.error(process.env.ENV === "production" ? "OK" : err.stack);
  
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || "Internal Server Error"
  });
}



module.exports = globalErrorHandler;