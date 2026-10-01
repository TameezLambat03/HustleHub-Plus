const express = require("express");
const protect = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { createGig, getGigs, updateGig, deleteGig } = require("../controllers/gigController");
const { body } = require("express-validator");
const validateControllerInput = require("../middleware/validateControllerInput");

const router = express.Router();

// Validation rules for Gig creation/update
const gigValidator = [
    body("title").isString().trim().notEmpty().withMessage("Title is required"),
    body("description").isString().trim().notEmpty().withMessage("Description is required"),
    body("category").isString().trim().notEmpty().withMessage("Category is required"),
    body("price").isNumeric().withMessage("Price must be a number").custom(value => value >= 0).withMessage("Price must be positive")
];

router.route("/")
    .get(getGigs) // Public: browse gigs
    .post(protect, authorize("freelancer"), gigValidator, validateControllerInput, createGig); // Freelancer only

router.route("/:id")
    .put(protect, authorize("freelancer"), gigValidator, validateControllerInput, updateGig) // Freelancer only (ownership checked in controller)
    .delete(protect, authorize("freelancer"), deleteGig); // Freelancer only (ownership checked in controller)

module.exports = router;