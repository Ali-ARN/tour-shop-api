const AppError = require("../utilities/appError");

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please try another value`;
  return new AppError(400, message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.erros).map((err) => err.message);
  const message = `Invalid input. ${errors.join(". ")}`;
  return new AppError(400, message);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode ||= 500;
  err.status ||= "error";

  if (process.env.NODE_ENV === "developement") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    sendErrorProd(error);
  }
};

exports.routeErrorHandler = (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "invalid URL",
  });
};
