
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

import {
  Users,
  CalendarCheck,
  FileText,
  Settings,
  Bell,
  UserCircle
} from "lucide-react";

const modules = [
  {
    name: "Admin Profile",
    icon: UserCircle,
    path: "/admin-profile"
  },
  {
    name: "Manage Students",
    icon: Users,
    path: "/students"
  },
  {
    name: "Attendance",
    icon: CalendarCheck,
    path: "/attendance"
  },
  {
    name: "Reports",
    icon: FileText,
    path: "/reports"
  },
  {
    name: "Notices",
    icon: Bell,
    path: "/notices"
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings"
  },
  {
    name: "Staff Approval",
    icon: Users,
    path: "/staff-approval"
  }
];

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">

      <div className="school-heading">
        <h2>Admin Dashboard</h2>
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

export default AdminDashboard;
