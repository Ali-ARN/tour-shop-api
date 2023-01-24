const catchAsync = require("../utilities/catchAsync");

exports.getTours = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
  });
});

exports.getOneTour = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
  });
});

exports.createTour = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
  });
});

exports.updateTour = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
  });
});

exports.deleteTour = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
  });
});
