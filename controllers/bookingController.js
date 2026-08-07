const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const ExpressError = require("../utils/ExpressError");

module.exports.renderBookingForm = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressError(404, "Listing not found");
    res.render("bookings/new", { listing });
  } catch (err) {
    next(err);
  }
};

module.exports.createBooking = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressError(404, "Listing not found");
    const { checkIn, checkOut, guests } = req.body.booking;
    if (new Date(checkOut) <= new Date(checkIn)) {
      throw new ExpressError(400, "Checkout date must be after check-in date");
    }
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;
    const booking = new Booking({ user: req.session.userId, listing: listing._id, checkIn, checkOut, guests, totalPrice, status: "Pending" });
    await booking.save();
    req.flash("success", "Booking request created");
    res.redirect("/bookings");
  } catch (err) {
    next(err);
  }
};

module.exports.index = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.session.userId }).populate("listing");
    res.render("bookings/index", { bookings });
  } catch (err) {
    next(err);
  }
};

module.exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new ExpressError(404, "Booking not found");
    booking.status = "Cancelled";
    await booking.save();
    req.flash("success", "Booking cancelled");
    res.redirect("/bookings");
  } catch (err) {
    next(err);
  }
};
