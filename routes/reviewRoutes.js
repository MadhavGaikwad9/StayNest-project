const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/reviewController");
const validate = require("../middleware/validate");
const reviewValidator = require("../validators/reviewValidator");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.post("/:id/reviews", isLoggedIn, validate(reviewValidator.reviewSchema), wrapAsync(reviewController.createReview));
router.delete("/:id/reviews/:reviewId", isLoggedIn, wrapAsync(reviewController.deleteReview));

module.exports = router;
