
import { useEffect, useState } from "react";
import api from "../services/api";
import "./StudentAttendance.css";

function StudentAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get("/attendance/my");
        setRecords(response.data.records || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load attendance"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const present = records.filter(r => r.status === "Present").length;
  const absent = records.filter(r => r.status === "Absent").length;
  const late = records.filter(r => r.status === "Late").length;

  const percentage = records.length
    ? ((present / records.length) * 100).toFixed(1)
    : 0;

  return (
    <div className="student-attendance">
      <h2>My Attendance</h2>
      <p>View your daily attendance records</p>

      {loading ? (
        <p>Loading attendance...</p>
      ) : error ? (
        <p className="attendance-error">{error}</p>
      ) : (
        <>
          <div className="attendance-summary">
            <div className="attendance-box">
              <h3>{present}</h3>
              <p>Present</p>
            </div>

            <div className="attendance-box">
              <h3>{absent}</h3>
              <p>Absent</p>
            </div>

            <div className="attendance-box">
              <h3>{late}</h3>
              <p>Late</p>
            </div>

            <div className="attendance-box">
              <h3>{percentage}%</h3>
              <p>Attendance</p>
            </div>
          </div>

          <div className="attendance-table">
            <h3>Attendance History</h3>

            {records.length === 0 ? (
              <p>No attendance records found.</p>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Student ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {records.map(record => (
                      <tr key={record._id}>
                        <td>{record.date}</td>
                        <td>{record.studentId}</td>
                        <td>
                          <span className={`status ${record.status.toLowerCase()}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StudentAttendance;
