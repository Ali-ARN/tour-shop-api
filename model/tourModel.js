const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    // required fields
    name: {
      type: String,
      unique: [true, "A tour name must be unique"],
      required: [true, "A tour must have a name"],
      maxLength: [40, "A tour name must be below 40 words"],
      minLength: [10, "A tour name must be above 10 words"],
    },

    price: {
      type: Number,
      required: [true, "A tour must have a price"],
      min: [100, "tour price must be above 100"],
    },

    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },

    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group max number"],
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "tour ratings average must be above 1"],
      max: [5, "tour ratings average must be below 5"],
    },

    summary: {
      type: String,
      required: [true, "A tour must have a summary"],
    },

    imageCover: {
      type: String,
      required: [true, "A tour must have a image cover"],
    },

    // optional fields
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "price discount ({VALUE}) must be below the actual price",
      },
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty."],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficulty must be 'easy', 'medium' or 'difficult'",
      },
    },

    description: {
      type: String,
      trim: true,
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    startDates: [Date],
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

tourSchema.virtual("durationWeek").get(function () {
  return this.duration / 7;
});

module.exports = mongoose.model("Tour", tourSchema, "tours");
