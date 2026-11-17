
import { Bell, Menu, UserCircle } from "lucide-react";

function Navbar({ role }) {
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <Menu size={25} />
        <span>Menu</span>
      </div>

      <div className="navbar-school">
        <img src="/images/school-logo.png" alt="School Logo" />
        <span>Swami Dayanand Public School</span>
      </div>

      <div className="navbar-right">
        <Bell size={22} className="notification-icon" />

        <div className="profile-info">
          <UserCircle size={29} />
          <div>
            <strong>{roleName}</strong>
            <small>{roleName} Portal</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
