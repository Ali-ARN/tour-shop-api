const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A review must have a text."],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    userID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must belong to a user."],
    },
    tourID: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "A review must belong to a tour"],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("Review", ReviewSchema);
