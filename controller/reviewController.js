const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");
const Review = require("../model/reviewModel");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);

  if (!review) return next(new AppError(500, "something went wrong."));

  res.status(201).json({
    status: "success",
    data: {
      review,
    },
  });
});
