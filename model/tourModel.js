const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  // required fields
  name: {
    type: String,
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
    required: [true, "A tour must have a ratings average"],
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
});

module.exports = mongoose.model("Tour", tourSchema, "tours");
