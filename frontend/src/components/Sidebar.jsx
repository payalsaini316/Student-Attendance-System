
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  Clock,
  Bell,
  UserCircle,
  Settings,
  LogOut
} from "lucide-react";

function Sidebar({ role }) {
  const menus = {
    student: [
      { name: "Dashboard", path: "/student-dashboard", icon: LayoutDashboard },
      { name: "My Profile", path: "/profile", icon: UserCircle },
      { name: "My Attendance", path: "/my-attendance", icon: CalendarCheck },
      { name: "Timetable", path: "/timetable", icon: Clock },
      { name: "Notices", path: "/notices", icon: Bell },
      { name: "Reports", path: "/reports", icon: FileText }
    ],

    staff: [
      { name: "Dashboard", path: "/staff-dashboard", icon: LayoutDashboard },
      { name: "Students", path: "/students", icon: Users },
      { name: "Mark Attendance", path: "/attendance", icon: CalendarCheck },
      { name: "Reports", path: "/reports", icon: FileText },
      { name: "Timetable", path: "/timetable", icon: Clock },
      { name: "Notices", path: "/notices", icon: Bell }
    ],

    admin: [
      { name: "Dashboard", path: "/admin-dashboard", icon: LayoutDashboard },
      { name: "Students", path: "/students", icon: Users },
      { name: "Attendance", path: "/attendance", icon: CalendarCheck },
      { name: "Reports", path: "/reports", icon: FileText },
      { name: "Timetable", path: "/timetable", icon: Clock },
      { name: "Staff Approval", path: "/staff-approval", icon: Users },
      { name: "Notices", path: "/notices", icon: Bell },
      { name: "Settings", path: "/settings", icon: Settings }
    ]
  };

  const userMenu = menus[role] || menus.student;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/images/school-logo.png" alt="School Logo" />
      </div>

      <nav className="sidebar-menu">
        {userMenu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="sidebar-link"
            >
              <Icon size={23} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        className="sidebar-logout"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
      >
        <LogOut size={21} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
