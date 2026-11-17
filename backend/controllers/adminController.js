
const User = require("../models/User");

// Get all pending staff requests
const getPendingStaff = async (req, res) => {
  try {
    const staff = await User.find({
      role: "staff",
      isApproved: false
    }).select("-password");

    res.status(200).json({ staff });
  } catch (error) {
    console.error("Get Pending Staff Error:", error);

    res.status(500).json({
      message: "Failed to fetch staff requests"
    });
  }
};

// Approve staff
const approveStaff = async (req, res) => {
  try {
    const staff = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "staff",
        isApproved: false
      },
      { isApproved: true },
      { returnDocument: "after" }
    ).select("-password");

    if (!staff) {
      return res.status(404).json({
        message: "Pending staff request not found"
      });
    }

    res.status(200).json({
      message: "Staff approved successfully",
      staff
    });
  } catch (error) {
    console.error("Approve Staff Error:", error);

    res.status(500).json({
      message: "Failed to approve staff"
    });
  }
};

// Reject staff request
const rejectStaff = async (req, res) => {
  try {
    const staff = await User.findOneAndDelete({
      _id: req.params.id,
      role: "staff",
      isApproved: false
    });

    if (!staff) {
      return res.status(404).json({
        message: "Pending staff request not found"
      });
    }

    res.status(200).json({
      message: "Staff request rejected"
    });
  } catch (error) {
    console.error("Reject Staff Error:", error);

    res.status(500).json({
      message: "Failed to reject staff"
    });
  }
};

module.exports = {
  getPendingStaff,
  approveStaff,
  rejectStaff
};
