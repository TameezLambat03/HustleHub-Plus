const Transaction = require("../Models/Transaction");

// Simple estimated tax rate for the freelancer dashboard.
// This is not a SARS calculation — Part 2 only requires an income indication.
const ESTIMATED_TAX_RATE = 0.25;

const getMyIncome = async (req, res, next) => {
    try {
        const filter = {
            status: "completed"
        };

        if (req.user.role === "freelancer") {
            filter.freelancerId = req.user.userId;
        }
        // Admin has no freelancer filter, so they can review all completed income

        const transactions = await Transaction.find(filter)
            .populate("bookingId", "status amount")
            .populate("clientId", "name email")
            .populate("freelancerId", "name email")
            .sort({ createdAt: -1 });

        const totalIncome = transactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        const estimatedTax = Number((totalIncome * ESTIMATED_TAX_RATE).toFixed(2));

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: {
                totalIncome,
                estimatedTax,
                taxRate: ESTIMATED_TAX_RATE,
                transactions
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyIncome
};
