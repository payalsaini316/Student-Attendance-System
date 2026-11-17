
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// Mark or update attendance
const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
      return res.status(400).json({
        message: "Student ID, date and status are required"
      });
    }

    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        student: student._id,
        date
      },
      {
        student: student._id,
        studentId: student.studentId,
        studentName: student.name,
        className: student.className,
        section: student.section,
        date,
        status
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Attendance saved successfully",
      attendance
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Get attendance records for staff and admin
const getAttendance = async (req, res) => {
  try {
    const { date, month, className, section } = req.query;

    const filter = {};

    if (date) {
      filter.date = date;
    }

    if (month) {
      const [year, monthNumber] = month.split("-").map(Number);
      const nextMonth = new Date(year, monthNumber, 1);

      const endDate =
        `${nextMonth.getFullYear()}-${String(
          nextMonth.getMonth() + 1
        ).padStart(2, "0")}-01`;

      filter.date = {
        $gte: `${month}-01`,
        $lt: endDate
      };
    }

    if (className) filter.className = className;
    if (section) filter.section = section;

    const records = await Attendance.find(filter)
      .sort({ date: -1, studentId: 1 });

    res.status(200).json({
      success: true,
      total: records.length,
      records
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get attendance of logged-in student only
const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID not found in account"
      });
    }

    const records = await Attendance.find({ studentId })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      total: records.length,
      records
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getMyAttendance
};
