const Gig = require("../Models/Gig");
const Booking = require("../Models/Booking");
const Transaction = require("../Models/Transaction");

// Create a booking (client only) and simulate payment
const createBooking = async (req, res, next) => {
    try {
        const { gigId } = req.body;

        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found"
            });
        }

        if (gig.isAvailable === false) {
            return res.status(400).json({
                success: false,
                message: "This gig is not available for booking"
            });
        }

        // A freelancer cannot book their own gig
        if (gig.freelancerId.toString() === req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You cannot book your own gig"
            });
        }

        const booking = await Booking.create({
            gigId: gig._id,
            clientId: req.user.userId,
            freelancerId: gig.freelancerId,
            amount: gig.price,
            status: "confirmed"
        });

        // Payment is simulated: a completed transaction is recorded
        // at the same time as the booking. No real payment gateway is used.
        const transaction = await Transaction.create({
            bookingId: booking._id,
            clientId: req.user.userId,
            freelancerId: gig.freelancerId,
            amount: gig.price,
            status: "completed"
        });

        res.status(201).json({
            success: true,
            message: "Booking created and payment simulated",
            data: {
                booking,
                transaction
            }
        });
    } catch (error) {
        next(error);
    }
};

// List bookings that belong to the logged-in user
const getMyBookings = async (req, res, next) => {
    try {
        const filter = {};

        if (req.user.role === "client") {
            filter.clientId = req.user.userId;
        } else if (req.user.role === "freelancer") {
            filter.freelancerId = req.user.userId;
        }
        // Admin has no filter, so they can view every booking

        const bookings = await Booking.find(filter)
            .populate("gigId", "title category price")
            .populate("clientId", "name email")
            .populate("freelancerId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getMyBookings
};
