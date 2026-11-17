
const express = require("express");
const router = express.Router();

const {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Only staff and admin can access student records
router.use(protect);
router.use(authorize("staff", "admin"));

router.post("/", addStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
