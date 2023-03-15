const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");

const Tour = require("../model/tourModel");
const User = require("../model/userModel");
const Reviews = require("../model/reviewModel");

dotenv.config({ path: "../.env" });
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE);

async function importData() {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Reviews.create(reviews);
    console.log("Data successfully imported.");
    process.exit();
  } catch (err) {
    console.log("SOMETHING WENT WRONG", err);
    process.exit();
  }
}

async function deleteData() {
try {  await Tour.deleteMany();
  await User.deleteMany(); await Reviews.deleteMany();
  console.log("Data successfully deleted.");
  process.exit();
} catch (err) {
    console.log(err)
  } 
}
const tours = JSON.parse(fs.readFileSync("../dev-data/tours.json"));
const users = JSON.parse(fs.readFileSync("../dev-data/users.json"));
const reviews = JSON.parse(fs.readFileSync("../dev-data/reviews.json"));

if (process.argv[2] === "--import") {
  importData();
}

if (process.argv[2] === "--delete") {
  deleteData();
}
