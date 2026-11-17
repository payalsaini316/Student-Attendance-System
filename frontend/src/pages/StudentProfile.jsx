
import "./StudentProfile.css";

function StudentProfile() {
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  return (
    <div className="student-profile">
      <h2>My Profile</h2>
      <p>Student personal information</p>

      <div className="student-profile-card">
        <div className="student-avatar">
          {(user.name || "S").charAt(0).toUpperCase()}
        </div>

        <h3>{user.name || "Student"}</h3>
        <span className="student-role">Student</span>

        <div className="student-details">
          <p><strong>Name:</strong> {user.name || "Not available"}</p>
          <p><strong>Email:</strong> {user.email || "Not available"}</p>
          <p><strong>Student ID:</strong> {user.studentId || "Not available"}</p>
          <p><strong>Class:</strong> {user.className || "Not available"}</p>
          <p><strong>Section:</strong> {user.section || "Not available"}</p>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
