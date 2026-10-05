const express = require("express");

const protect = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { getMyIncome } = require("../controllers/transactionController");

const router = express.Router();

router.get(
    "/income",
    protect,
    authorize("freelancer", "admin"),
    getMyIncome
);

module.exports = router;
