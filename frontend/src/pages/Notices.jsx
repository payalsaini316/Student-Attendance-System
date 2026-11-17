
import { useEffect, useState } from "react";
import { Bell, Trash2, CalendarDays } from "lucide-react";
import api from "../services/api";
import "./Notices.css";

function Notices() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notices");
      setNotices(response.data.notices || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load notices"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const addNotice = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Please fill all fields");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.post("/notices", {
        title: title.trim(),
        description: description.trim()
      });

      setTitle("");
      setDescription("");
      setMessage("Notice published successfully!");

      await fetchNotices();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to publish notice"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteNotice = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/notices/${id}`);

      setNotices((old) =>
        old.filter((notice) => notice._id !== id)
      );

      setMessage("Notice deleted successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete notice"
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="notices-page">

      <div className="notices-heading">
        <div>
          <h2>School Notices</h2>
          <p>
            {isAdmin
              ? "Publish and manage school announcements"
              : "Latest school announcements"}
          </p>
        </div>
        <Bell size={30} />
      </div>

      {isAdmin && (
        <form className="notice-form" onSubmit={addNotice}>
          <h3>Publish New Notice</h3>

          <input
            type="text"
            placeholder="Notice Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Write notice description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />

          <button type="submit" disabled={saving}>
            {saving ? "Publishing..." : "Publish Notice"}
          </button>
        </form>
      )}

      {message && (
        <p className="notice-success">{message}</p>
      )}

      {error && (
        <p className="notice-error">{error}</p>
      )}

      <div className="notice-list-heading">
        <h3>All Notices</h3>
        <span>{notices.length} Notices</span>
      </div>

      {loading ? (
        <p className="notice-empty">Loading notices...</p>
      ) : notices.length === 0 ? (
        <p className="notice-empty">
          No notices published yet.
        </p>
      ) : (
        <div className="notice-list">
          {notices.map((notice) => (
            <div className="notice-card" key={notice._id}>
              <div className="notice-card-top">
                <div className="notice-icon">
                  <Bell size={22} />
                </div>

                {isAdmin && (
                  <button
                    className="notice-delete"
                    onClick={() => deleteNotice(notice._id)}
                    type="button"
                    title="Delete notice"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <h3>{notice.title}</h3>
              <p>{notice.description}</p>

              <div className="notice-date">
                <CalendarDays size={15} />
                <span>{formatDate(notice.createdAt)}</span>
              </div>

              <small>
                Published by: {notice.publishedBy?.name || "School Admin"}
              </small>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Notices;
