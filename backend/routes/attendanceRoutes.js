
const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  getMyAttendance
} = require("../controllers/attendanceController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// All routes require login
router.use(protect);

// Student: View only their own attendance
router.get(
  "/my",
  authorize("student"),
  getMyAttendance
);

// Staff and Admin: Mark and view attendance
router.post(
  "/",
  authorize("staff", "admin"),
  markAttendance
);

router.get(
  "/",
  authorize("staff", "admin"),
  getAttendance
);

module.exports = router;
