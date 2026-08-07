const ExpressError = require("../utils/ExpressError");

module.exports = (schema) => (req, res, next) => {
  const result = schema.validate(req.body, { abortEarly: false });
  if (result.error) {
    const message = result.error.details.map((item) => item.message).join(", ");
    throw new ExpressError(400, message);
  }
  next();
};
