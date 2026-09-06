const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    registerValidator,
    loginValidator,
    validationErrorHandler
} = require("../middleware/validator");

const {
    registerUser,
    loginUser,
    getCurrentUser
} = require("../controllers/authController");

const router = express.Router();


// ============================================================
// REGISTER
// ============================================================

router.post(
    "/register",
    registerValidator,
    validationErrorHandler,
    async (req, res, next) => {
        try {
            await registerUser(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);


// ============================================================
// LOGIN
// ============================================================

router.post(
    "/login",
    loginValidator,
    validationErrorHandler,
    async (req, res, next) => {
        try {
            await loginUser(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);


// ============================================================
// CURRENT USER
// ============================================================

router.get(
    "/me",
    protect,
    getCurrentUser
);


module.exports = router;