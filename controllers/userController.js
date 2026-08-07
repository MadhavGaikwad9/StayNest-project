const bcrypt = require("bcrypt");
const User = require("../models/User");
const ExpressError = require("../utils/ExpressError");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    req.session.userId = user._id;
    req.flash("success", "Welcome to StayNest");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new ExpressError(401, "Invalid email or password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ExpressError(401, "Invalid email or password");
    }
    req.session.userId = user._id;
    req.flash("success", `Welcome back, ${user.username}`);
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

module.exports.renderProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render("users/profile", { currentUser: user });
  } catch (err) {
    next(err);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new ExpressError(401, "Current password is incorrect");
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    req.flash("success", "Password updated successfully");
    res.redirect("/users/profile");
  } catch (err) {
    next(err);
  }
};

module.exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/users/login");
  });
};
