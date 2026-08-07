const Joi = require("joi");

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      "number.min": "Rating must be between 1 and 5",
      "number.max": "Rating must be between 1 and 5",
      "any.required": "Rating is required",
    }),
    comment: Joi.string().trim().required().messages({
      "string.empty": "Comment is required",
      "any.required": "Comment is required",
    }),
  }).required(),
});