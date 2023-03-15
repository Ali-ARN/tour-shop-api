const express = require("express");
const router = express.Router();
const tourController = require("../controller/tourController");
const authController = require("../controller/authController");
const reviewRoute = require("../routes/reviewRoute");

router.route("/stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router.use("/:tourId/reviews", reviewRoute);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.restrictTo("admin", "lead-guides"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getOneTour)
  .patch(
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
