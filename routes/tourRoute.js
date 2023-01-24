const express = require("express");
const router = express.Router();
const tourController = require("../controller/tourController");

router
  .route("/api/v1/tours")
  .get(tourController.getTours)
  .post(tourController.createTour);
router
  .route("/api/v1/tours/:id")
  .get(tourController.getOneTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
