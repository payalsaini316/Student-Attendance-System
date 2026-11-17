
import { useState, useEffect } from "react";
import {
  Search, Plus, Edit, Trash2, X, Users
} from "lucide-react";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent
} from "../services/studentService";
import "./Students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const emptyForm = {
    id: "",
    name: "",
    className: "",
    section: "",
    gender: "",
    phone: ""
  };

  const [form, setForm] = useState(emptyForm);

  // Load students from MongoDB
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudents();

      const formattedStudents = data.map((student) => ({
        mongoId: student._id,
        id: student.studentId,
        name: student.name,
        className: student.className,
        section: student.section,
        gender: student.gender || "",
        phone: student.mobile || ""
      }));

      setStudents(formattedStudents);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load students. Check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search and class filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.id.toLowerCase().includes(search.toLowerCase());

    const matchesClass =
      classFilter === "All" ||
      student.className === classFilter;

    return matchesSearch && matchesClass;
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add or update student in MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const studentData = {
        studentId: form.id.trim(),
        name: form.name.trim(),
        className: form.className,
        section: form.section,
        gender: form.gender,
        mobile: form.phone.trim()
      };

      if (editId) {
        await updateStudent(editId, studentData);
        alert("Student updated successfully!");
      } else {
        await addStudent(studentData);
        alert("Student added successfully!");
      }

      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);

      await fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save student. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setForm({
      id: student.id,
      name: student.name,
      className: student.className,
      section: student.section,
      gender: student.gender,
      phone: student.phone
    });

    setEditId(student.mongoId);
    setShowForm(true);
  };

  // Delete student
  const handleDelete = async (mongoId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        setError("");

        await deleteStudent(mongoId);

        alert("Student deleted successfully!");

        await fetchStudents();
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to delete student."
        );
      }
    }
  };

  return (
    <div className="students-page">

      <div className="students-heading">
        <div>
          <h2>Student Management</h2>
          <p>Manage all school student records</p>
        </div>

        <button
          className="add-student-btn"
          onClick={() => {
            setForm(emptyForm);
            setEditId(null);
            setShowForm(true);
          }}
        >
          <Plus size={19} /> Add Student
        </button>
      </div>

      <div className="student-stat">
        <div className="stat-icon">
          <Users size={30} />
        </div>
        <div>
          <p>Total Students</p>
          <h2>{students.length}</h2>
        </div>
      </div>

      {error && (
        <p style={{ color: "red", margin: "12px 0" }}>
          {error}
        </p>
      )}

      <div className="students-toolbar">
        <div className="search-box">
          <Search size={19} />
          <input
            placeholder="Search by name or student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="All">All Classes</option>

          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={String(i + 1)}>
              Class {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="students-table-wrapper">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Gender</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="no-students">
                  Loading students...
                </td>
              </tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.mongoId}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.className}</td>
                  <td>{student.section}</td>
                  <td>{student.gender}</td>
                  <td>{student.phone}</td>
                  <td>
                    <div className="student-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(student)}
                        title="Edit"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(student.mongoId)
                        }
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-students">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="student-modal-overlay">
          <div className="student-modal">

            <div className="modal-heading">
              <h3>
                {editId ? "Edit Student" : "Add New Student"}
              </h3>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setForm(emptyForm);
                }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Student ID</label>
              <input
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="Enter Student ID"
                required
                disabled={Boolean(editId)}
              />

              <label>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />

              <div className="form-row">
                <div>
                  <label>Class</label>
                  <select
                    name="className"
                    value={form.className}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Class</option>

                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        Class {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Section</label>
                  <select
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
              </div>

              <label>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <label>Mobile Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter mobile number"
                type="tel"
                pattern="[0-9]{10}"
                required
              />

              <button
                type="submit"
                className="save-student-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editId
                  ? "Update Student"
                  : "Save Student"}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Students;
