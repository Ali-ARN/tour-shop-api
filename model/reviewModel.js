const mongoose = require("mongoose");
const Tour = require("./tourModel");

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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must belong to a user."],
    },
    tour: {
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

ReviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        numRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].numRating,
    ratingsAverage: stats[0].avgRating,
  });
  console.log(stats);
};

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

ReviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});

ReviewSchema.post(/^findOneAnd/, function (document) {
  document.constructor.calcAverageRatings(document.tour);
});
module.exports = mongoose.model("Review", ReviewSchema);
