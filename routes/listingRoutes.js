const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const listingValidator = require("../validators/listingValidator");
const listingController = require("../controllers/listingController");
const Listing = require("../models/listing");

router.get("/", wrapAsync(listingController.index));
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.post("/", isLoggedIn, validate(listingValidator.listingSchema), wrapAsync(listingController.createListing));

router.get("/:id", wrapAsync(listingController.showListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(new Error("Listing not found"));
    req.listing = listing;
    next();
  }),
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(new Error("Listing not found"));
    req.listing = listing;
    next();
  }),
  isOwner,
  validate(listingValidator.listingSchema),
  wrapAsync(listingController.updateListing)
);

router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(new Error("Listing not found"));
    req.listing = listing;
    next();
  }),
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
