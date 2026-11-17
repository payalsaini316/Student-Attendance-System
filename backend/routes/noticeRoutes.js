
const express = require("express");
const router = express.Router();

const {
  getNotices,
  createNotice,
  deleteNotice
} = require("../controllers/noticeController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Login required for all notice routes
router.use(protect);

// Students, staff and admin can view notices
router.get("/", authorize("student", "staff", "admin"), getNotices);

// Only admin can publish or delete
router.post("/", authorize("admin"), createNotice);
router.delete("/:id", authorize("admin"), deleteNotice);

module.exports = router;
