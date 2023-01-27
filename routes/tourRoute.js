const express = require("express");
const router = express.Router();
const tourController = require("../controller/tourController");

router.route("/").get(tourController.getTours).post(tourController.createTour);
router.route("/stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
router
  .route("/:id")
  .get(tourController.getOneTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
