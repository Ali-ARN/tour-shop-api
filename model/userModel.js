const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },

  email: {
    type: String,
    required: [true, "A user must have a email"],
    unique: [true, "user email must be unique"],
    validate: [validator.isEmail, "please enter a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minLength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "user must confirm his password"],
    minLength: 8,
    validate: {
      // only works with save() and create()
      validator: function (val) {
        return this.password === val;
      },
      message: "passwords are not the same",
    },
  },

  changedPasswordAt: Date,
  resetPasswordToken: String,
  resetPasswordTokenExpiresIn: Date,
  active: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ["user", "guide", "guide-leader", "admin"],
    default: "user",
  },
});

//////////////////////////////////////////////////////////////////////////////////////////////

// Sign up middleware
userSchema.pre("save", async function (next) {
  // Only runs this function if password was modified
  if (!this.isModified("password")) return next();

  // hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // delete the password confirm
  this.passwordConfirm = undefined;
  next();
});

//////////////////////////////////////////////////////////////////////////////////////////////

// Update password middleware
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.changedPasswordAt = Date.now() - 1;

  next();
});

//////////////////////////////////////////////////////////////////////////////////////////////
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});
//////////////////////////////////////////////////////////////////////////////////////////////

userSchema.methods.correctPassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

//////////////////////////////////////////////////////////////////////////////////////////////

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.changedPasswordAt) {
    const changeTimestamp = parseInt(
      this.changedPasswordAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changeTimestamp;
  }
  return false;
};

//////////////////////////////////////////////////////////////////////////////////////////////

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordTokenExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
