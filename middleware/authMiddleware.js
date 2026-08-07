const User = require("../models/User");
const ExpressError = require("../utils/ExpressError");

const isLoggedIn = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    req.flash("error", "Please log in to continue");
    return res.redirect("/users/login");
  }
  next();
};

const isOwner = async (req, res, next) => {
  try {
    const currentUser = req.session.userId;
    if (!currentUser) {
      throw new ExpressError(401, "You are not authorized");
    }

    if (req.listing) {
      if (!req.listing.owner.equals(currentUser)) {
        throw new ExpressError(403, "You do not own this listing");
      }
    }

    if (req.review) {
      if (!req.review.author.equals(currentUser)) {
        throw new ExpressError(403, "You do not own this review");
      }
    }

    if (req.booking) {
      if (!req.booking.user.equals(currentUser)) {
        throw new ExpressError(403, "You do not own this booking");
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

const storeUserInLocals = async (req, res, next) => {
  res.locals.currentUser = null;
  if (req.session && req.session.userId) {
    const user = await User.findById(req.session.userId);
    res.locals.currentUser = user;
  }
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
};

module.exports = { isLoggedIn, isOwner, storeUserInLocals };
