
const express = require("express");
const router = express.Router();

const {
  getTimetable,
  saveTimetable,
  updateTimetable,
  deleteTimetable
} = require("../controllers/timetableController");

const { protect, authorize } = require("../middleware/authMiddleware");

// All routes require login
router.use(protect);

// Students, staff and admin can view timetable
router.get("/", getTimetable);

// Only staff and admin can manage timetable
router.post(
  "/",
  authorize("staff", "admin"),
  saveTimetable
);

router.put(
  "/:id",
  authorize("staff", "admin"),
  updateTimetable
);

router.delete(
  "/:id",
  authorize("staff", "admin"),
  deleteTimetable
);

module.exports = router;
