const { body, validationResult } = require("express-validator");

// ============================================================
// REGISTRATION VALIDATION
// ============================================================

const registerValidator = [
    body("name")
        .isString()
        .withMessage("Name must be text")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters"),

    body("email")
        .isString()
        .withMessage("Email must be text")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .isString()
        .withMessage("Password must be text")
        .isLength({ min: 8, max: 100 })
        .withMessage("Password must be between 8 and 100 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one special character"),

    body("role")
        .isString()
        .withMessage("Role must be text")
        .trim()
        .toLowerCase()
        .isIn(["client", "freelancer"])
        .withMessage("Role must be either client or freelancer")
];


// ============================================================
// LOGIN VALIDATION
// ============================================================

const loginValidator = [
    body("email")
        .isString()
        .withMessage("Email must be text")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .isString()
        .withMessage("Password must be text")
        .notEmpty()
        .withMessage("Password is required")
];


// ============================================================
// VALIDATION ERROR HANDLER
// ============================================================

const validationErrorHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }

    next();
};


// ============================================================
// EXPORT VALIDATORS
// ============================================================

module.exports = {
    registerValidator,
    loginValidator,
    validationErrorHandler
};