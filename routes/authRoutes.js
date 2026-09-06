const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    registerValidator,
    loginValidator
} = require("../middleware/validator");

const validateControllerInput = require("../middleware/validateControllerInput");

const {
    registerUser,
    loginUser,
    getCurrentUser
} = require("../controllers/authController");

const router = express.Router();

// REGISTER
router.post(
    "/register",
    registerValidator,
    validateControllerInput,
    registerUser
);

// LOGIN
router.post(
    "/login",
    loginValidator,
    validateControllerInput,
    loginUser
);

// CURRENT USER
router.get(
    "/me",
    protect,
    getCurrentUser
);

module.exports = router;