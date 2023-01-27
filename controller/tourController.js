const Tour = require("../model/tourModel");
const catchAsync = require("../utilities/catchAsync");
const APIFeatures = require("../utilities/apiFeatures");
const AppError = require("../utilities/appError");
exports.getTours = catchAsync(async (req, res) => {
  console.log(req.query);
  // creating query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // executing query
  const tours = await features.query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getOneTour = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return new AppError(404, "Invalid tour id");
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  if (!newTour) {
    return new AppError(404, "something went very wrong");
  }

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return new AppError(404, "something went very wrong");
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return new AppError(404, "something went very wrong");
  }
  res.status(200).json({
    status: "success",
  });
});

exports.getTourStats = catchAsync(async (req, res) => {
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
  if (!stats) return new AppError(404, "something went very wrong");
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
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
