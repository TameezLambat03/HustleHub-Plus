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

module.exports = {
    createBooking
};
