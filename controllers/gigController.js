const Gig = require("../Models/Gig");

// Create a gig (freelancer only)
const createGig = async (req, res, next) => {
    try {
        const { title, description, category, price } = req.body;
        const gig = await Gig.create({
            title,
            description,
            category,
            price,
            freelancerId: req.user.userId // from JWT payload
        });
        res.status(201).json({ success: true, data: gig });
    } catch (error) {
        next(error);
    }
};

// Get all gigs (public)
const getGigs = async (req, res, next) => {
    try {
        const gigs = await Gig.find().populate("freelancerId", "name email");
        res.status(200).json({ success: true, data: gigs });
    } catch (error) {
        next(error);
    }
};
const getGigById = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id)
            .populate("freelancerId", "name email");

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found"
            });
        }

        res.status(200).json({
            success: true,
            data: gig
        });
    } catch (error) {
        next(error);
    }
};

// Update own gig (freelancer only, ownership enforced in the query)
const updateGig = async (req, res, next) => {
    try {
        const { title, description, category, price } = req.body;

        const updatedGig = await Gig.findOneAndUpdate(
            {
                _id: req.params.id,
                freelancerId: req.user.userId
            },
            {
                title,
                description,
                category,
                price
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!updatedGig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found or you are not authorized to update it"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedGig
        });
    } catch (error) {
        next(error);
    }
};

// Delete own gig (freelancer only, ownership check)
const deleteGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) return res.status(404).json({ success: false, message: "Gig not found" });

        if (gig.freelancerId.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this gig" });
        }

        await gig.deleteOne();
        res.status(200).json({ success: true, message: "Gig deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createGig,
    getGigs,
    getGigById,
    updateGig,
    deleteGig
};