
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import {
  CalendarCheck,
  Clock,
  FileText,
  Bell,
  UserCircle
} from "lucide-react";

const modules = [
  { name: "My Profile", icon: UserCircle, path: "/profile" },
  { name: "My Attendance", icon: CalendarCheck, path: "/my-attendance" },
  { name: "Timetable", icon: Clock, path: "/timetable" },
  { name: "Notices", icon: Bell, path: "/student-notices" },
  { name: "Attendance Reports", icon: FileText, path: "/student-reports" }
];

function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="student-dashboard">
      <div className="school-heading">
        <h2>Student Dashboard</h2>
        <p>Welcome to Swami Dayanand Public School</p>
      </div>

      <div className="module-grid">
        {modules.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              className="module-card"
              key={item.name}
              onClick={() => navigate(item.path)}
            >
              <Icon size={58} strokeWidth={1.8} />
              <p>{item.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StudentDashboard;
