const User = require("../model/userModel");
const catchAsync = require("../utilities/catchAsync");
const handleError = require("./errorController");
const AppError = require("../utilities/appError");
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    if (!newUser) return new AppError(404, "something went very wrong");

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    handleError(error, req, res);
  }
};
