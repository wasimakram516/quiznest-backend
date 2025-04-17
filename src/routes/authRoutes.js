const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// Public routes
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

// Admin registration (protected route - only admins can register new admins)
router.post("/register", protect, adminOnly, authController.registerAdmin);

module.exports = router;
