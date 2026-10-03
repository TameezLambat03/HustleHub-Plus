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

// Update own gig (freelancer only, ownership check)
const updateGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) return res.status(404).json({ success: false, message: "Gig not found" });

        // Ownership check: only the freelancer who created the gig can update it
        if (gig.freelancerId.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: "Not authorized to update this gig" });
        }

        // FIX: Replaced { new: true } with { returnDocument: 'after' } to fix Mongoose warning
        const updatedGig = await Gig.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { returnDocument: 'after', runValidators: true }
        );
        res.status(200).json({ success: true, data: updatedGig });
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