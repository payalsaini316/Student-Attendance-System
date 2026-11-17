import "./AdminProfile.css";
function AdminProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="admin-profile">
      <h2>Admin Profile</h2>
      <p>Welcome to Swami Dayanand Public School</p>

      <div className="profile-card">
        <div className="profile-avatar">A</div>
        <h3>{user.name || "Administrator"}</h3>
        <p>Administrator</p>

        <div className="profile-details">
          <p><strong>Name:</strong> {user.name || "Not available"}</p>
          <p><strong>Email:</strong> {user.email || "Not available"}</p>
          <p><strong>Role:</strong> {user.role || "Admin"}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
