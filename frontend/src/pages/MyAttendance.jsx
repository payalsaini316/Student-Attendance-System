
import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle, XCircle, Percent } from "lucide-react";
import api from "../services/api";
import "./MyAttendance.css";

function MyAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const fetchMyAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/attendance/my");
      setRecords(response.data.records || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  const presentCount = records.filter(
    (item) => item.status?.toLowerCase() === "present"
  ).length;

  const absentCount = records.filter(
    (item) => item.status?.toLowerCase() === "absent"
  ).length;

  const percentage =
    records.length > 0
      ? Math.round((presentCount / records.length) * 100)
      : 0;

  const formatDate = (date) => {
    if (!date) return "-";

    const [year, month, day] = date.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="my-attendance-page">
      <div className="my-attendance-heading">
        <div>
          <h2>My Attendance</h2>
          <p>View your personal attendance records</p>
        </div>

        <CalendarDays size={30} />
      </div>

      <div className="attendance-summary">
        <div className="attendance-stat">
          <CheckCircle size={28} />
          <div>
            <h3>{presentCount}</h3>
            <p>Present Days</p>
          </div>
        </div>

        <div className="attendance-stat">
          <XCircle size={28} />
          <div>
            <h3>{absentCount}</h3>
            <p>Absent Days</p>
          </div>
        </div>

        <div className="attendance-stat">
          <Percent size={28} />
          <div>
            <h3>{percentage}%</h3>
            <p>Attendance Percentage</p>
          </div>
        </div>
      </div>

      <div className="my-attendance-table-card">
        <div className="my-attendance-table-heading">
          <h3>Attendance History</h3>
          <span>{records.length} Records</span>
        </div>

        {loading ? (
          <p className="attendance-info">Loading attendance...</p>
        ) : error ? (
          <p className="attendance-error">{error}</p>
        ) : records.length === 0 ? (
          <p className="attendance-info">
            No attendance records found yet.
          </p>
        ) : (
          <div className="attendance-table-scroll">
            <table className="my-attendance-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {records.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.subject || "General"}</td>
                    <td>
                      <span
                        className={`attendance-status ${
                          item.status?.toLowerCase()
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAttendance;
