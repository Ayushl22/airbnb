const express = require("express");
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require("../schema");

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");

const reviewController = require("../controllers/reviews");
const { isLoggedIn, isReviewAuthor } = require("../middleware");


// ======================
// Validation Middleware
// ======================

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// ======================
// CREATE REVIEW
// ======================

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);


// ======================
// DELETE REVIEW
// ======================

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);


module.exports = router;