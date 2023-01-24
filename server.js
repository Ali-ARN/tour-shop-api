const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB connected!!!");
  }
);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server listening on port ${port} ...`);
});
