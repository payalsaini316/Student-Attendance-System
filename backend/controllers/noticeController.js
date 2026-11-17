
const Notice = require("../models/Notice");

// Get all notices
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("publishedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: notices.length,
      notices
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create notice - Admin only
const createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "Title and description are required"
      });
    }

    const notice = await Notice.create({
      title: title.trim(),
      description: description.trim(),
      publishedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Notice published successfully",
      notice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete notice - Admin only
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotices,
  createNotice,
  deleteNotice
};
