const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, statusCode, message });
};

module.exports = errorResponse;
