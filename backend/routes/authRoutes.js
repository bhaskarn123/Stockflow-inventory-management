const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

// Signup
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Test protected route
router.get("/verify", protect, (req, res) => {
    res.status(200).json({
        message: "You are authenticated!",
        user: req.user
    });
});

module.exports = router;