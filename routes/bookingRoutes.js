const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get("/", isLoggedIn, wrapAsync(bookingController.index));
router.get("/:id/book", isLoggedIn, wrapAsync(bookingController.renderBookingForm));
router.post("/:id", isLoggedIn, wrapAsync(bookingController.createBooking));
router.post("/:id/cancel", isLoggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;
