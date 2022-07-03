const errorMiddleware = (err, req, res, next) => {
  const httpStatus = err.status || 500;

  return res.status(httpStatus).json({
    status: httpStatus,
    message: err.message || "Internal server error",
  });
};

const notFoundMiddleware = (req, res, next) =>
  res
    .status(404)
    .json({ ok: false, status: 404, message: "Resource not found" });

module.exports = { errorMiddleware, notFoundMiddleware };
