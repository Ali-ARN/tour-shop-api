const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
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
  role: {
    type: String,
    enum: ["user", "admin", "guide", "lead-guide"],
  },
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

  changedPasswordAt: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  // Only runs this function if password was modified
  if (!this.isModified("password")) return next();

  // hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // delete the password confirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

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

const User = mongoose.model("User", userSchema);

module.exports = User;
