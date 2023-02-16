const { promisify } = require("util");
const crypto = require("crypto");
const User = require("../model/userModel");
const catchAsync = require("../utilities/catchAsync");
const handleError = require("./errorController");
const AppError = require("../utilities/appError");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utilities/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const cookieOptions = {
  httpOnly: true,
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("JWT", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    changedPasswordAt: req.body.changedPasswordAt,
  });

  if (!newUser) next(new AppError(404, "something went very wrong"));

  createSendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  // 1) get the email and password
  const { email, password } = req.body;
  console.log(email, password);
  // 2) check if user provided any email or password
  if (!email || !password) {
    return new AppError(400, "please provide email and password!");
  }

  // 3) search for that email to find the user
  const user = await User.findOne({ email }).select("+password");

  // 4) check if user exists or password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(401, "Incorrect email or password"));
  }
  createSendToken(user, 200, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Geting token and check if it's there
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  // console.log(token);

  if (!token)
    return next(
      new AppError(
        401,
        "You are not logged in, you have to log in to get access"
      )
    );

  // 2) Verfication token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(401, "The user belonging to this token no longer exists")
    );
  }

  // 4) check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(401, "User recently changed password. Please log in again")
    );
  }

  req.user = freshUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role, roles);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          "you do not have the permission to perform this action"
        )
      );
    }

    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) search for the user with given email by the user
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new AppError(404, "no user found with this email."));
  // generate the reset password token
  const resetToken = await user.createResetPasswordToken();
  user.save({ validateBeforeSave: false });

  // send the token via email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? send a PATCH request with your new password and passwordConfirm to ${resetURL}\n If you didn't forget your password, simply ignore this email!`;

  try {
    await sendEmail({ email, subject: "Reset Password", text: message });

    res.status(200).json({
      status: "success",
      message: "token sent to email!",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresIn = undefined;
    user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        500,
        "There was an error while sending email, please try again"
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpiresIn: { $gt: Date.now() },
  });
  // 2) If token has not expired and there is a user, set the new password
  if (!user) {
    return next(new AppError(400, "The token is invalid or has expired"));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiresIn = undefined;
  await user.save({ validateBeforeSave: false });

  // 3) Update changedPasswordAt proptery for the user

  // 4) Login the user and send JWT

  createSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user from collection
  const user = await User.findById(req.user.id).select("+password");
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError(404, "The current password is not correct!"));
  }
  // 3) If so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4) Log user in, send JWT

  createSendToken(user, 200, res);
});
