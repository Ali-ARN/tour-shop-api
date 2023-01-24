const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config("./.env");

const app = express();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE, () => {
  console.log("DB connected!!!");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server listening on port ${port} ...`);
});
