const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { getAdminStats } = require("../controllers/adminController");

router.get("/stats", protect, authorize("admin"), getAdminStats);

module.exports = router;