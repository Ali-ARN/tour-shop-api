const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },

  email: {
    type: String,
    required: [true, "A user must have a email"],
    unique: true,
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
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
