const Joi = require("joi");

module.exports.registerSchema = Joi.object({
  username: Joi.string().trim().alphanum().min(3).max(20).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports.loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});