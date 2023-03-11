const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");
const Review = require("../model/reviewModel");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  req.body.tour ||= req.params.tourId;
  req.body.user ||= req.user.id;
  const review = await Review.create(req.body);

  if (!review) return next(new AppError(500, "something went wrong."));

  res.status(201).json({
    status: "success",
    data: {
      review,
    },
  });
});
