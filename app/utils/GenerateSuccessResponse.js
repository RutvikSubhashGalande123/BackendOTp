const successResponse = (res, statusCode, data, message) => {
  res.status(statusCode).json({ success: true, statusCode, data, message });
};

module.exports = successResponse;
