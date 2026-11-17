
import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  FileText
} from "lucide-react";

import { getReportData } from "../services/reportService";
import "./Reports.css";

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function Reports() {
  const [reportType, setReportType] = useState("Daily");
  const [classFilter, setClassFilter] = useState("All");
  const [date, setDate] = useState(getToday());
  const [search, setSearch] = useState("");

  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch attendance records from MongoDB
  useEffect(() => {
    let cancelled = false;

    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const filters = {
          ...(reportType === "Daily"
            ? { date }
            : { month: date.slice(0, 7) }),
          ...(classFilter !== "All"
            ? { className: classFilter }
            : {})
        };

        const data = await getReportData(filters);

        if (!cancelled) {
          setAllRecords(data.map((record) => ({
            id: record.studentId,
            name: record.studentName,
            className: record.className,
            section: record.section,
            date: record.date,
            status: record.status
          })));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            "Unable to load attendance reports."
          );
          setAllRecords([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchReports();

    return () => {
      cancelled = true;
    };
  }, [reportType, classFilter, date]);

  // Search locally within fetched report records
  const records = useMemo(() => {
    return allRecords.filter((student) => {
      return (
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.id.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [allRecords, search]);

  const present = records.filter(
    (student) => student.status === "Present"
  ).length;

  const absent = records.filter(
    (student) => student.status === "Absent"
  ).length;

  const late = records.filter(
    (student) => student.status === "Late"
  ).length;

  const total = records.length;

  const percentage = total
    ? Math.round((present / total) * 100)
    : 0;

  // Download filtered records as CSV
  const downloadCSV = () => {
    if (records.length === 0) {
      alert("No records available to download.");
      return;
    }

    const headings = [
      "Student ID",
      "Student Name",
      "Class",
      "Section",
      "Date",
      "Status"
    ];

    const rows = records.map((student) => [
      student.id,
      student.name,
      student.className,
      student.section,
      student.date,
      student.status
    ]);

    const csv = [headings, ...rows]
      .map((row) =>
        row.map((value) =>
          `"${String(value ?? "").replace(/"/g, '""')}"`
        ).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `attendance-report-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">

      <div className="reports-heading">
        <div>
          <h2>Attendance Reports</h2>
          <p>View and download school attendance records</p>
        </div>

        <button
          className="download-report"
          onClick={downloadCSV}
          disabled={loading || records.length === 0}
        >
          <Download size={18} /> Download CSV
        </button>
      </div>

      <div className="report-filters">

        <div>
          <label>Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="Daily">Daily Report</option>
            <option value="Monthly">Monthly Report</option>
          </select>
        </div>

        <div>
          <label>Select Class</label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="All">All Classes</option>

            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                Class {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>{reportType === "Daily" ? "Date" : "Month"}</label>
          <input
            type={reportType === "Daily" ? "date" : "month"}
            value={reportType === "Daily" ? date : date.slice(0, 7)}
            onChange={(e) =>
              setDate(
                reportType === "Daily"
                  ? e.target.value
                  : `${e.target.value}-01`
              )
            }
          />
        </div>

      </div>

      {error && (
        <p style={{ color: "red", margin: "12px 0" }}>
          {error}
        </p>
      )}

      <div className="report-summary">

        <div className="report-card blue">
          <Users size={30} />
          <div>
            <p>Total Records</p>
            <h2>{loading ? "..." : total}</h2>
          </div>
        </div>

        <div className="report-card green">
          <CheckCircle size={30} />
          <div>
            <p>Present</p>
            <h2>{loading ? "..." : present}</h2>
          </div>
        </div>

        <div className="report-card red">
          <XCircle size={30} />
          <div>
            <p>Absent</p>
            <h2>{loading ? "..." : absent}</h2>
          </div>
        </div>

        <div className="report-card orange">
          <Clock size={30} />
          <div>
            <p>Late</p>
            <h2>{loading ? "..." : late}</h2>
          </div>
        </div>

      </div>

      <div className="percentage-card">
        <div>
          <h3>Attendance Percentage</h3>
          <p>Present records divided by total attendance records</p>
        </div>

        <h2>{loading ? "..." : `${percentage}%`}</h2>

        <div className="percentage-track">
          <div style={{ width: `${percentage}%` }} />
        </div>
      </div>

      <div className="report-table-card">

        <div className="report-table-heading">
          <div>
            <h3>
              <FileText size={20} /> Attendance Details
            </h3>
            <p>{reportType} attendance records</p>
          </div>

          <input
            type="search"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="report-table-scroll">
          <table className="report-table">

            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-report">
                    Loading attendance records...
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((student, index) => (
                  <tr key={`${student.id}-${student.date}-${index}`}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.className}</td>
                    <td>{student.section}</td>
                    <td>{student.date}</td>
                    <td>
                      <span
                        className={`report-status ${student.status.toLowerCase()}`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-report">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}

export default Reports;
