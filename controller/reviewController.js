const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");
const Review = require("../model/reviewModel");
const factory = require("./handlerFactory");
exports.setUserAndTourIds = (req, res, next) => {
  req.body.tour ||= req.params.tourId;
  req.body.user ||= req.user.id;
  next();
};
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
