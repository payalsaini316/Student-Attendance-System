
import { useState } from "react";
import "./Settings.css";

function Settings() {
  const [schoolName, setSchoolName] = useState(
    "Swami Dayanand Public School"
  );

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "schoolSettings",
      JSON.stringify({ schoolName, email, phone })
    );

    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">
      <h2>School Settings</h2>
      <p>Manage your school information</p>

      <form className="settings-card" onSubmit={handleSave}>
        <label>School Name</label>
        <input
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          required
        />

        <label>School Email</label>
        <input
          type="email"
          placeholder="Enter school email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Contact Number</label>
        <input
          type="tel"
          placeholder="Enter contact number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
}

export default Settings;
