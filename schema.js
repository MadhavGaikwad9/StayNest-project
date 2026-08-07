const listingValidator = require("./validators/listingValidator");
const reviewValidator = require("./validators/reviewValidator");
const userValidator = require("./validators/userValidator");

module.exports = {
  listingSchema: listingValidator.listingSchema,
  reviewSchema: reviewValidator.reviewSchema,
  registerSchema: userValidator.registerSchema,
  loginSchema: userValidator.loginSchema,
};