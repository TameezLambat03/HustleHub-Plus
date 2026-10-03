const express = require("express");
const protect = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const {
    createGig,
    getGigs,
    getGigById,
    updateGig,
    deleteGig
} = require("../controllers/gigController");

const { body } = require("express-validator");
const validateControllerInput = require("../middleware/validateControllerInput");

const router = express.Router();

// Validation rules for Gig creation/update
const gigValidator = [
    body("title")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("description")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("category")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("price")
        .isNumeric()
        .withMessage("Price must be a number")
        .custom(value => value >= 0)
        .withMessage("Price must be positive")
];

// Browse all gigs
router.route("/")
    .get(getGigs)
    .post(
        protect,
        authorize("freelancer"),
        gigValidator,
        validateControllerInput,
        createGig
    );

// View / update / delete one gig
router.route("/:id")
    .get(getGigById)
    .put(
        protect,
        authorize("freelancer"),
        gigValidator,
        validateControllerInput,
        updateGig
    )
    .delete(
        protect,
        authorize("freelancer"),
        deleteGig
    );

module.exports = router;