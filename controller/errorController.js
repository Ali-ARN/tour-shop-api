// GLOBAL ERROR HANDLER
module.exports = (err, req, res) => {
  err.statusCode ||= 500;
  err.status ||= "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
