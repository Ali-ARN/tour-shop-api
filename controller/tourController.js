const Tour = require("../model/tourModel");
const catchAsync = require("../utilities/catchAsync");
const APIFeatures = require("../utilities/apiFeatures");
const AppError = require("../utilities/appError");
const factory = require("./handlerFactory");

exports.getAllTours = factory.getAll(Tour);
exports.getOneTour = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
// Aggregations

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $group: {
        _id: null,
        numTours: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRatings: { $avg: "$ratingsAverage" },
        minRating: { $min: "$ratingsAverage" },
        maxRating: { $max: "$ratingsAverage" },
      },
    },
  ]);
  if (!stats) return next(new AppError(404, "something went very wrong"));
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const monthly = await Tour.aggregate([
    { $unwind: "$startDates" },
    {
      $match: {
        startDates: {
          $gt: new Date(`${req.params.year}-01-01`),
          $lt: new Date(`${req.params.year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTours: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },

    {
      $sort: { numTours: -1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    months: monthly.length,
    data: {
      monthly,
    },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { latlng, unit, distance } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng)
    return next(new AppError(401, "Please provide a latitude and longitude"));
  // console.log(lat, lng, unit, distance);

  const tours = await Tour.find({
    $geoWithin: { $centerSphere: [[lng, lat], radius] },
  });

  res.status(200)
});
