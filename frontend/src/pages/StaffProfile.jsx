
import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import "./StaffProfile.css";

function StaffProfile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    } catch {
      setUser({});
    }
  }, []);

  return (
    <div className="staff-profile-page">
      <div className="staff-profile-heading">
        <UserCircle size={32} />
        <div>
          <h2>My Profile</h2>
          <p>Staff personal information</p>
        </div>
      </div>

      <div className="staff-profile-card">
        <div className="staff-profile-avatar">
          <UserCircle size={65} />
        </div>

        <h3>{user.name || "Staff Member"}</h3>
        <p className="staff-role">Staff</p>

        <div className="staff-profile-details">
          <div>
            <span>Full Name</span>
            <strong>{user.name || "Not available"}</strong>
          </div>
          <div>
            <span>Email Address</span>
            <strong>{user.email || "Not available"}</strong>
          </div>
          <div>
            <span>Mobile Number</span>
            <strong>{user.mobile || "Not available"}</strong>
          </div>
          <div>
            <span>Staff ID</span>
            <strong>{user.staffId || "Not available"}</strong>
          </div>
          <div>
            <span>Designation</span>
            <strong>{user.designation || "Not available"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffProfile;
