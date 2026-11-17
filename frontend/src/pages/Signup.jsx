
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    studentId: "",
    staffId: "",
    className: "",
    section: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = { ...formData, role };
      delete data.confirmPassword;

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );

      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <img src="/images/school-logo.png" alt="School Logo" className="school-logo" />

        <h2>SWAMI DAYANAND PUBLIC SCHOOL</h2>
        <p>Create your school account</p>

        <div className="signup-tabs">
          <button
            type="button"
            className={role === "student" ? "active" : ""}
            onClick={() => {
              setRole("student");
              setError("");
              setMessage("");
            }}
          >
            Student
          </button>

          <button
            type="button"
            className={role === "staff" ? "active" : ""}
            onClick={() => {
              setRole("staff");
              setError("");
              setMessage("");
            }}
          >
            Staff
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" required />

          <label>Email Address</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required />

          <label>Mobile Number</label>
          <input name="mobile" type="tel" value={formData.mobile} onChange={handleChange} placeholder="Enter mobile number" required />

          {role === "student" ? (
            <>
              <label>Student ID</label>
              <input name="studentId" value={formData.studentId} onChange={handleChange} placeholder="Enter Student ID" required />

              <label>Class</label>
              <select name="className" value={formData.className} onChange={handleChange} required>
                <option value="">Select Class</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>Class {i + 1}</option>
                ))}
              </select>

              <label>Section</label>
              <select name="section" value={formData.section} onChange={handleChange} required>
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </>
          ) : (
            <>
              <label>Staff ID</label>
              <input name="staffId" value={formData.staffId} onChange={handleChange} placeholder="Enter Staff ID" required />

              <label>Designation</label>
              <select name="designation" value={formData.designation} onChange={handleChange} required>
                <option value="">Select Designation</option>
                <option value="Teacher">Teacher</option>
                <option value="Principal">Principal</option>
                <option value="Admin">Admin</option>
              </select>
            </>
          )}

          <label>Password</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create password" minLength={8} required />

          <label>Confirm Password</label>
          <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" minLength={8} required />

          {error && <p className="signup-error">{error}</p>}
          {message && <p className="signup-success">{message}</p>}

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
