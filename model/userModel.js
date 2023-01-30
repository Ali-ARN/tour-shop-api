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

  password: {
    type: String,
    required: [true, "A user must have a password"],
    minLength: 8,
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

const User = mongoose.model("User", userSchema);

module.exports = User;
