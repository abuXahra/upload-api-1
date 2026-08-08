function errorMiddleware(err, req, res, next) {
  return res
    .status(err.statusCode || 500)
    .send(err.message || "Internal sever error");
  next();
}

module.exports = errorMiddleware;
