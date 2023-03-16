const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");
const APIFeatures = require("../utilities/apiFeatures");

exports.getAll = Model => {
  return catchAsync(async (req, res, next) => {
    let filter;
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // creating query
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // executing query
    const documents = await features.query;

    res.status(200).json({
      status: "success",
      results: documents.length,
      data: {
        data: documents,
      },
    });
  });
};

exports.deleteOne = Model => {
  return catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError(404, `No document found with this ID.`));
    }
    res.status(204).json({
      status: "success",
    });
  });
};

exports.updateOne = Model => {
  return catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError(404, "No document found with this ID."));
    }

    res.status(200).json({
      status: "success",
      data: {
        document,
      },
    });
  });
};

exports.createOne = Model => {
  return catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    if (!newDocument) {
      return next(new AppError(404, "something went very wrong"));
    }

    res.status(201).json({
      status: "success",
      data: {
        data: newDocument,
      },
    });
  });
};

exports.getOne = (Model, populateOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = await Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const document = await query;

    if (!document) {
      return next(new AppError(404, "No document found with this ID."));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });
};
