const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required().messages({
      "any.required": "Title is required",
      "string.empty": "Title is required",
    }),
    description: Joi.string().trim().required().messages({
      "any.required": "Description is required",
      "string.empty": "Description is required",
    }),
    location: Joi.string().trim().required().messages({
      "any.required": "Location is required",
      "string.empty": "Location is required",
    }),
    country: Joi.string().trim().required().messages({
      "any.required": "Country is required",
      "string.empty": "Country is required",
    }),
    price: Joi.number().positive().required().messages({
      "number.positive": "Price must be greater than zero",
      "any.required": "Price is required",
    }),
    category: Joi.string().valid("Trending", "Beach", "Mountains", "Cities", "Luxury", "Camping", "Farms", "Rooms"),
    image: Joi.object({
      url: Joi.string().uri().allow(""),
      filename: Joi.string().allow(""),
    }),
  }).required(),
});