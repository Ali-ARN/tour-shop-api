const User = require("../model/userModel");
const AppError = require("../utilities/appError");
const factory = require("./handlerFactory");
const catchAsync = require("../utilities/catchAsync");
const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) filteredObj[el] = obj[el];
  });

  return filteredObj;
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
// This cotroller isn't for updating password
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// User actions
exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError(400, "This route is not for updating password!"));

  const filteredBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteProfile = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getProfile = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
