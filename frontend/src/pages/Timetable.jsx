
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save } from "lucide-react";
import api from "../services/api";
import "./Timetable.css";

const days = [
  "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

const emptyPeriod = {
  subject: "",
  teacher: "",
  startTime: "",
  endTime: "",
  room: "",
  type: "Class"
};

function Timetable() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isStudent = user.role === "student";

  const [className, setClassName] = useState(
    isStudent ? user.className || "1" : "1"
  );
  const [section, setSection] = useState(
    isStudent ? user.section || "A" : "A"
  );
  const [day, setDay] = useState("Monday");
  const [periods, setPeriods] = useState([]);
  const [recordId, setRecordId] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState(emptyPeriod);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/timetable", {
        params: { className, section, day }
      });

      const record = response.data.records?.[0];

      setPeriods(record?.periods || []);
      setRecordId(record?._id || null);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to load timetable"
      );
      setPeriods([]);
      setRecordId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [className, section, day]);

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addOrUpdatePeriod = () => {
    if (
      !form.subject.trim() ||
      !form.startTime ||
      !form.endTime
    ) {
      setMessage("Subject and both timings are required.");
      return;
    }

    if (form.endTime <= form.startTime) {
      setMessage("End time must be later than start time.");
      return;
    }

    if (editingIndex !== null) {
      setPeriods((old) =>
        old.map((item, index) =>
          index === editingIndex ? { ...form } : item
        )
      );
      setEditingIndex(null);
    } else {
      setPeriods((old) => [...old, { ...form }]);
    }

    setForm(emptyPeriod);
    setMessage("");
  };

  const editPeriod = (index) => {
    setForm({ ...periods[index] });
    setEditingIndex(index);
  };

  const deletePeriod = (index) => {
    setPeriods((old) => old.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setForm(emptyPeriod);
    }
  };

  const saveTimetable = async () => {
    try {
      setLoading(true);
      setMessage("");

      const payload = {
        className,
        section,
        day,
        periods
      };

      if (recordId) {
        await api.put(`/timetable/${recordId}`, { periods });
      } else {
        await api.post("/timetable", payload);
      }

      setMessage("Timetable saved successfully!");
      await fetchTimetable();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to save timetable"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="timetable-page">
      <div className="timetable-heading">
        <div>
          <h2>Class Timetable</h2>
          <p>Manage and view class-wise weekly timetable</p>
        </div>
      </div>

      <div className="timetable-filters">
        <div>
          <label>Class</label>
          <select
            value={className}
            disabled={isStudent}
            onChange={(e) => setClassName(e.target.value)}
          >
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
            value={section}
            disabled={isStudent}
            onChange={(e) => setSection(e.target.value)}
          >
            {["A", "B", "C"].map((item) => (
              <option key={item} value={item}>
                Section {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Day</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            {days.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message && <p className="timetable-message">{message}</p>}

      {!isStudent && (
        <div className="period-form">
          <h3>{editingIndex !== null ? "Edit Period" : "Add New Period"}</h3>

          <div className="period-form-grid">
            <input
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleFormChange}
            />
            <input
              name="teacher"
              placeholder="Teacher Name"
              value={form.teacher}
              onChange={handleFormChange}
            />
            <input
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleFormChange}
            />
            <input
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={handleFormChange}
            />
            <input
              name="room"
              placeholder="Room Number"
              value={form.room}
              onChange={handleFormChange}
            />
            <select
              name="type"
              value={form.type}
              onChange={handleFormChange}
            >
              <option value="Class">Class</option>
              <option value="Break">Break</option>
              <option value="Activity">Activity</option>
            </select>
          </div>

          <button className="primary-btn" onClick={addOrUpdatePeriod}>
            <Plus size={17} />
            {editingIndex !== null ? "Update Period" : "Add Period"}
          </button>
        </div>
      )}

      <div className="timetable-table-card">
        <div className="table-title">
          <h3>Class {className} - Section {section}</h3>
          <span>{day}</span>
        </div>

        {loading ? (
          <p className="table-status">Loading timetable...</p>
        ) : (
          <div className="table-scroll">
            <table className="timetable-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Type</th>
                  {!isStudent && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {periods.length === 0 ? (
                  <tr>
                    <td colSpan={isStudent ? 6 : 7} className="empty-row">
                      No timetable added for this day.
                    </td>
                  </tr>
                ) : (
                  periods.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>
                      <td>{item.subject}</td>
                      <td>{item.teacher || "-"}</td>
                      <td>{item.startTime} - {item.endTime}</td>
                      <td>{item.room || "-"}</td>
                      <td>{item.type}</td>
                      {!isStudent && (
                        <td className="action-buttons">
                          <button
                            onClick={() => editPeriod(index)}
                            title="Edit period"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => deletePeriod(index)}
                            title="Delete period"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isStudent && (
        <button
          className="primary-btn save-timetable-btn"
          onClick={saveTimetable}
          disabled={loading}
        >
          <Save size={17} />
          Save Timetable
        </button>
      )}
    </div>
  );
}

export default Timetable;
