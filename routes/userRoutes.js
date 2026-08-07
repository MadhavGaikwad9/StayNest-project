const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validate = require("../middleware/validate");
const userValidator = require("../validators/userValidator");

router.get("/register", userController.renderRegisterForm);
router.post("/register", validate(userValidator.registerSchema), userController.register);
router.get("/login", userController.renderLoginForm);
router.post("/login", validate(userValidator.loginSchema), userController.login);
router.get("/profile", userController.renderProfile);
router.post("/reset-password", userController.resetPassword);
router.get("/logout", userController.logout);

module.exports = router;
