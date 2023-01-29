const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const app = express();
const tourRoute = require("./routes/tourRoute");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./controller/errorController");

app.use(express.json());

// DATABASE
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DATABASE)
  .catch((err) => console.error(err.message));

// ROUTES
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);

// global error controller
app.all("*", errorHandler);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server listening on port ${port} ...`);
});
