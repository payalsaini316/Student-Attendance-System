
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import DashboardLayout from "./layouts/DashboardLayout";

import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import MyAttendance from "./pages/MyAttendance";
import Timetable from "./pages/Timetable";

import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";
import AdminProfile from "./pages/AdminProfile";
import StaffProfile from "./pages/StaffProfile";
import Notices from "./pages/Notices";
import StaffApproval from "./pages/StaffApproval";
import Students from "./pages/Students";

import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";

// Protect routes from users who are not logged in
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(savedUser);
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "student") {
      return <Navigate to="/student-dashboard" replace />;
    }

    if (user.role === "staff") {
      return <Navigate to="/staff-dashboard" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          {/* Student Routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-attendance"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyAttendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/timetable"
            element={
              <ProtectedRoute allowedRoles={["student", "staff", "admin"]}>
                <Timetable />
              </ProtectedRoute>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff-dashboard"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff-profile"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <StaffProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-profile"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notices"
            element={
              <ProtectedRoute allowedRoles={["admin", "staff", "student"]}>
                <Notices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-notices"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Notices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff-approval"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <StaffApproval />
              </ProtectedRoute>
            }
          />

          {/* Common Staff and Admin Routes */}
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={["staff", "admin"]}>
                <Students />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={["staff", "admin"]}>
                <Attendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["staff", "admin"]}>
                <Reports />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
