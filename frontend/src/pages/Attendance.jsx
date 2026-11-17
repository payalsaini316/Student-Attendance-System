
import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Save
} from "lucide-react";

import {
  getClassStudents,
  getAttendance,
  saveStudentAttendance
} from "../services/attendanceService";

import "./Attendance.css";

function getLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Attendance() {
  const [className, setClassName] = useState("8");
  const [section, setSection] = useState("A");
  const [date, setDate] = useState(getLocalDate());

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load students and saved attendance for selected class/date
  useEffect(() => {
    let cancelled = false;

    const loadAttendanceData = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const allStudents = await getClassStudents();

        const classStudents = allStudents.filter(
          (student) =>
            student.className === className &&
            student.section === section
        );

        const savedRecords = await getAttendance(
          date,
          className,
          section
        );

        if (cancelled) return;

        const recordsByStudentId = new Map(
          savedRecords.map((record) => [
            record.studentId,
            record.status
          ])
        );

        const formattedStudents = classStudents.map(
          (student) => ({
            mongoId: student._id,
            id: student.studentId,
            name: student.name,
            status: recordsByStudentId.get(student.studentId) || "Present"
          })
        );

        setStudents(formattedStudents);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            "Unable to load attendance. Check backend connection."
          );
          setStudents([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAttendanceData();

    return () => {
      cancelled = true;
    };
  }, [className, section, date]);

  const updateStatus = (id, status) => {
    setStudents((previous) =>
      previous.map((student) =>
        student.id === id
          ? { ...student, status }
          : student
      )
    );

    setMessage("");
    setError("");
  };

  const markAll = (status) => {
    setStudents((previous) =>
      previous.map((student) => ({
        ...student,
        status
      }))
    );

    setMessage("");
    setError("");
  };

  const present = students.filter(
    (student) => student.status === "Present"
  ).length;

  const absent = students.filter(
    (student) => student.status === "Absent"
  ).length;

  const late = students.filter(
    (student) => student.status === "Late"
  ).length;

  // Save attendance records to MongoDB
  const saveAttendance = async () => {
    if (students.length === 0) {
      setError("No students found in this class and section.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      for (const student of students) {
        await saveStudentAttendance({
          studentId: student.id,
          date,
          status: student.status
        });
      }

      setMessage("Attendance saved successfully in MongoDB!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save attendance. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="attendance-page">

      <div className="attendance-heading">
        <div>
          <h2>Attendance Management</h2>
          <p>Manage daily student attendance</p>
        </div>
      </div>

      {/* CLASS FILTERS */}
      <div className="attendance-filters">

        <div>
          <label>Select Class</label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            disabled={loading || saving}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                Class {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            disabled={loading || saving}
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>

        <div>
          <label>Attendance Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={getLocalDate()}
            disabled={loading || saving}
          />
        </div>

      </div>

      {/* SUMMARY CARDS */}
      <div className="attendance-summary">

        <div className="attendance-stat total">
          <Users size={30} />
          <div>
            <p>Total Students</p>
            <h2>{students.length}</h2>
          </div>
        </div>

        <div className="attendance-stat present">
          <CheckCircle size={30} />
          <div>
            <p>Present</p>
            <h2>{present}</h2>
          </div>
        </div>

        <div className="attendance-stat absent">
          <XCircle size={30} />
          <div>
            <p>Absent</p>
            <h2>{absent}</h2>
          </div>
        </div>

        <div className="attendance-stat late">
          <Clock size={30} />
          <div>
            <p>Late</p>
            <h2>{late}</h2>
          </div>
        </div>

      </div>

      {/* ATTENDANCE TABLE */}
      <div className="attendance-table-container">

        <div className="attendance-table-heading">
          <div>
            <h3>Student Attendance</h3>
            <p>Class {className} - Section {section}</p>
          </div>

          <div className="attendance-actions">
            <button
              onClick={() => markAll("Present")}
              disabled={loading || saving || students.length === 0}
            >
              Mark All Present
            </button>

            <button
              className="save-attendance"
              onClick={saveAttendance}
              disabled={loading || saving || students.length === 0}
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>

        <div className="attendance-table-scroll">
          <table className="attendance-table">

            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Attendance Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3">Loading students...</td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.mongoId}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>

                    <td>
                      <div className="attendance-status-buttons">

                        <button
                          className={
                            student.status === "Present"
                              ? "status-btn present-active"
                              : "status-btn"
                          }
                          onClick={() =>
                            updateStatus(student.id, "Present")
                          }
                          disabled={saving}
                        >
                          Present
                        </button>

                        <button
                          className={
                            student.status === "Absent"
                              ? "status-btn absent-active"
                              : "status-btn"
                          }
                          onClick={() =>
                            updateStatus(student.id, "Absent")
                          }
                          disabled={saving}
                        >
                          Absent
                        </button>

                        <button
                          className={
                            student.status === "Late"
                              ? "status-btn late-active"
                              : "status-btn"
                          }
                          onClick={() =>
                            updateStatus(student.id, "Late")
                          }
                          disabled={saving}
                        >
                          Late
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">
                    No students found for this class and section.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {error && (
          <p className="attendance-message" style={{ color: "red" }}>
            {error}
          </p>
        )}

        {message && (
          <p className="attendance-message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Attendance;
