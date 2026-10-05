const express = require("express");
const { body } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const validateControllerInput = require("../middleware/validateControllerInput");
const { createBooking, getMyBookings } = require("../controllers/bookingController");

const router = express.Router();

const bookingValidator = [
    body("gigId")
        .isMongoId()
        .withMessage("A valid gig ID is required")
];

router.post(
    "/",
    protect,
    authorize("client"),
    bookingValidator,
    validateControllerInput,
    createBooking
);

router.get(
    "/",
    protect,
    authorize("client", "freelancer", "admin"),
    getMyBookings
);

module.exports = router;
