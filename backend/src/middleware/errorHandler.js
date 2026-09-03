const errorHandler = (err, req, res, next) => {
  console.error("=================================");
  console.error("ERROR:", err.message);
  console.error("=================================");

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

module.exports = errorHandler;