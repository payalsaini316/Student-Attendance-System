
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  UserCircle,
  CheckCircle,
  XCircle,
  Percent,
  Bell
} from "lucide-react";

import api from "../services/api";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long"
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [attendanceResponse, timetableResponse] =
          await Promise.all([
            api.get("/attendance/my"),
            api.get("/timetable", {
              params: {
                className: user.className,
                section: user.section,
                day: today
              }
            })
          ]);

        setAttendance(attendanceResponse.data.records || []);

        const timetableRecord =
          timetableResponse.data.records?.[0];

        setTimetable(timetableRecord?.periods || []);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const present = attendance.filter(
    item => item.status?.toLowerCase() === "present"
  ).length;

  const absent = attendance.filter(
    item => item.status?.toLowerCase() === "absent"
  ).length;

  const percentage = attendance.length
    ? Math.round((present / attendance.length) * 100)
    : 0;

  const modules = [
    {
      name: "My Profile",
      icon: UserCircle,
      path: "/profile"
    },
    {
      name: "My Attendance",
      icon: CalendarCheck,
      path: "/my-attendance"
    },
    {
      name: "Timetable",
      icon: Clock,
      path: "/timetable"
    }
  ];

  return (
    <div className="student-dashboard-page">

      <div className="school-heading">
        <div>
          <h2>Student Dashboard</h2>
          <p>Welcome to Swami Dayanand Public School</p>
        </div>

        <div className="student-welcome">
          <UserCircle size={38} />
          <div>
            <h4>{user.name || "Student"}</h4>
            <p>
              Class {user.className || "-"} - Section {user.section || "-"}
            </p>
          </div>
        </div>
      </div>

      <h3 className="dashboard-section-title">
        Attendance Overview
      </h3>

      <div className="student-stats-grid">

        <div className="student-stat-card">
          <CheckCircle size={30} />
          <div>
            <h3>{loading ? "..." : present}</h3>
            <p>Present Days</p>
          </div>
        </div>

        <div className="student-stat-card">
          <XCircle size={30} />
          <div>
            <h3>{loading ? "..." : absent}</h3>
            <p>Absent Days</p>
          </div>
        </div>

        <div className="student-stat-card">
          <Percent size={30} />
          <div>
            <h3>{loading ? "..." : `${percentage}%`}</h3>
            <p>Attendance</p>
          </div>
        </div>

      </div>

      <h3 className="dashboard-section-title">
        Quick Access
      </h3>

      <div className="module-grid">
        {modules.map(item => {
          const Icon = item.icon;

          return (
            <div
              className="module-card"
              key={item.name}
              onClick={() => navigate(item.path)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter") navigate(item.path);
              }}
            >
              <Icon size={48} strokeWidth={1.8} />
              <p>{item.name}</p>
            </div>
          );
        })}
      </div>

      <div className="student-timetable-card">
        <div className="student-timetable-heading">
          <div>
            <h3>Today's Timetable</h3>
            <p>{today}</p>
          </div>
          <Clock size={28} />
        </div>

        {loading ? (
          <p className="dashboard-empty">Loading timetable...</p>
        ) : timetable.length === 0 ? (
          <p className="dashboard-empty">
            No timetable added for today.
          </p>
        ) : (
          <div className="student-timetable-list">
            {timetable.map((period, index) => (
              <div className="student-period" key={index}>
                <div className="period-number">
                  {index + 1}
                </div>

                <div className="period-details">
                  <h4>{period.subject}</h4>
                  <p>
                    {period.teacher || "Teacher not assigned"}
                  </p>
                </div>

                <div className="period-time">
                  {period.startTime} - {period.endTime}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="view-timetable-btn"
          onClick={() => navigate("/timetable")}
        >
          View Full Timetable
        </button>
      </div>

      <div className="student-notice-info">
        <Bell size={22} />
        <div>
          <h4>School Notices</h4>
          <p>
            School announcements will appear here when the notices
            feature is connected for students.
          </p>
        </div>
      </div>

    </div>
  );
}

export default StudentDashboard;
