const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
    getAdminStats,
    getAdminUsers
} = require("../controllers/adminController");


router.get("/stats", protect, authorize("admin"), getAdminStats);
router.get("/users", protect, authorize("admin"), getAdminUsers);

module.exports = router;