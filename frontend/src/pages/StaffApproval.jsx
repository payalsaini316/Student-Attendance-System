
import { useEffect, useState } from "react";
import api from "../services/api";
import "./StaffApproval.css";

function StaffApproval() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      const response = await api.get("/admin/staff/pending");
      setStaff(response.data.staff || []);
    } catch (error) {
      console.error("Staff loading error:", error);
      alert("Staff requests load nahi hui. Backend route check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const approveStaff = async (id) => {
    try {
      await api.patch(`/admin/staff/${id}/approve`);
      alert("Staff approved successfully!");
      fetchStaff();
    } catch (error) {
      alert(error.response?.data?.message || "Approval failed");
    }
  };

  const rejectStaff = async (id) => {
    if (!window.confirm("Reject this staff request?")) return;

    try {
      await api.patch(`/admin/staff/${id}/reject`);
      alert("Staff request rejected");
      fetchStaff();
    } catch (error) {
      alert(error.response?.data?.message || "Rejection failed");
    }
  };

  if (loading) return <p>Loading staff requests...</p>;

  return (
    <div className="staff-approval">
      <h2>Staff Approval</h2>
      <p>Review staff registration requests</p>

      {staff.length === 0 ? (
        <p>No pending staff requests.</p>
      ) : (
        staff.map((person) => (
          <div className="staff-card" key={person._id}>
            <h3>{person.name}</h3>
            <p>Email: {person.email}</p>
            <p>Staff ID: {person.staffId}</p>

            <button onClick={() => approveStaff(person._id)}>
              Approve
            </button>

            <button onClick={() => rejectStaff(person._id)}>
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default StaffApproval;
