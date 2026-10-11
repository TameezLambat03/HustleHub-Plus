
const User = require("../models/User");
const Gig = require("../Models/Gig");
const Booking = require("../Models/Booking");
const Transaction = require("../Models/Transaction");

const getAdminStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalClients,
            totalFreelancers,
            totalAdmins,
            totalGigs,
            availableGigs,
            totalBookings,
            pendingBookings,
            confirmedBookings,
            completedBookings,
            cancelledBookings,
            totalTransactions,
            completedTransactions,
            transactionTotals
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "client" }),
            User.countDocuments({ role: "freelancer" }),
            User.countDocuments({ role: "admin" }),

            Gig.countDocuments(),
            Gig.countDocuments({ isAvailable: true }),

            Booking.countDocuments(),
            Booking.countDocuments({ status: "pending" }),
            Booking.countDocuments({ status: "confirmed" }),
            Booking.countDocuments({ status: "completed" }),
            Booking.countDocuments({ status: "cancelled" }),

            Transaction.countDocuments(),
            Transaction.countDocuments({ status: "completed" }),
            Transaction.aggregate([
                { $match: { status: "completed" } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ])
        ]);

        res.json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    clients: totalClients,
                    freelancers: totalFreelancers,
                    admins: totalAdmins
                },
                gigs: {
                    total: totalGigs,
                    available: availableGigs
                },
                bookings: {
                    total: totalBookings,
                    pending: pendingBookings,
                    confirmed: confirmedBookings,
                    completed: completedBookings,
                    cancelled: cancelledBookings
                },
                transactions: {
                    total: totalTransactions,
                    completed: completedTransactions,
                    completedAmount: transactionTotals[0]?.total || 0
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const getAdminUsers = async (req, res, next) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminStats,
    getAdminUsers
};
