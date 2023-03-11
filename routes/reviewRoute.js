const router = require("express").Router({ mergeParams: true });
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  );

module.exports = router;