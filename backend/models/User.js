
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    mobile: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      required: true
    },

    studentId: {
      type: String,
      default: null
    },

    staffId: {
      type: String,
      default: null
    },

    className: {
      type: String,
      default: null
    },

    section: {
      type: String,
      default: null
    },

    designation: {
      type: String,
      default: null
    },

    isApproved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
