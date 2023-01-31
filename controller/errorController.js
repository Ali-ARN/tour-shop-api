exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode ||= 500;
  err.status ||= "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

exports.routeErrorHandler = (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "invalid URL",
  });
};
