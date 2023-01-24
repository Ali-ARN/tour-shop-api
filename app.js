const express = require("express");
const app = express();
const tourRoute = require("./routes/tourRoute");

app.use(express.json());

app.use(tourRoute);

// global error controller
app.all("*", (req, res) => {
  res.json({
    status: "error",
  });
});

module.exports = app;
