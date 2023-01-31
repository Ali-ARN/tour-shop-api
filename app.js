const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const app = express();
const tourRoute = require("./routes/tourRoute");
const userRoute = require("./routes/userRoute");
const errorController = require("./controller/errorController");

app.use(express.json());

// DATABASE
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("database connected"))
  .catch((err) => console.error(err.message));

// ROUTES
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);

// global error controller
app.use(errorController.globalErrorHandler);

// invalid url error handler
app.use(errorController.routeErrorHandler);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server listening on port ${port} ...`);
});
