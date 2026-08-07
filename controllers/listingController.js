const Listing = require("../models/Listing");
const Review = require("../models/Review");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res, next) => {
  try {
    const { category, location, minPrice, maxPrice, sortBy } = req.query;
    const query = {};

    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let listings = Listing.find(query).populate("owner");

    if (sortBy === "lowest") listings = listings.sort({ price: 1 });
    else if (sortBy === "highest") listings = listings.sort({ price: -1 });
    else listings = listings.sort({ createdAt: -1 });

    const allListings = await listings;
    res.render("listings/index", { allListings, filters: req.query, categories: ["Trending", "Beach", "Mountains", "Cities", "Luxury", "Camping", "Farms", "Rooms"] });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new", { categories: ["Trending", "Beach", "Mountains", "Cities", "Luxury", "Camping", "Farms", "Rooms"] });
};

module.exports.createListing = async (req, res, next) => {
  try {
    const listing = new Listing({ ...req.body.listing, owner: req.session.userId });
    await listing.save();
    req.flash("success", "Listing created successfully");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.showListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    const reviewCount = listing.reviews.length;
    const averageRating = reviewCount ? (listing.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(1) : "New";
    res.render("listings/show", { listing, averageRating, reviewCount });
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res) => {
  res.render("listings/edit", { listing: req.listing, categories: ["Trending", "Beach", "Mountains", "Cities", "Luxury", "Camping", "Farms", "Rooms"] });
};

module.exports.updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing }, { new: true });
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteListing = async (req, res, next) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};
