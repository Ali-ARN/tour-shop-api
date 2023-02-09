const express = require("express");
const router = express.Router();
const tourController = require("../controller/tourController");
const authController = require("../controller/authController");
router.route("/stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, tourController.getTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getOneTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
