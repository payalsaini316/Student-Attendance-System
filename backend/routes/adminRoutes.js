
const express = require("express");
const router = express.Router();

const {
  getPendingStaff,
  approveStaff,
  rejectStaff
} = require("../controllers/adminController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Only logged-in admin can access these routes
router.use(protect);
router.use(authorize("admin"));

router.get("/staff/pending", getPendingStaff);
router.patch("/staff/:id/approve", approveStaff);
router.patch("/staff/:id/reject", rejectStaff);

module.exports = router;
