
import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="login-page">
      <div className="login-card">

        <img
          src="/images/school-logo.png"
          alt="School Logo"
          className="school-logo"
        />

        <h2>SWAMI DAYANAND PUBLIC SCHOOL</h2>

        <h3>Forgot Password?</h3>

        <p>Enter your registered email address.</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter registered email"
            required
          />

          <button type="submit" className="login-button">
            Reset Password
          </button>
        </form>

        <p className="signup-text">
          Remember your password? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;
