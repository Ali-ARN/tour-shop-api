const User = require("../model/userModel");
const catchAsync = require("../utilities/catchAsync");
const handleError = require("./errorController");
const AppError = require("../utilities/appError");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    if (!newUser) return new AppError(404, "something went very wrong");

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    // 1) get the email and password
    const { email, password } = req.body;

    // 2) check if user provided any email or password
    if (!email || !password) {
      return new AppError(400, "please provide email and password!");
    }

    // 3) search for that email to find the user
    const user = await User.findOne({ email }).select("+password");

    // 4) check if user exists, if not returns an error
    if (!user) return next(new AppError(404, "no user found with thi email"));

    const token = "";
    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};
