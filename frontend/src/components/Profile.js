// frontend/src/components/Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function Profile() {
  const { state } = useLocation();
  const user = state?.user || JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); // ✅ for navigation

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    login_time: "",
    logout_time: ""
  });

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://${process.env.REACT_APP_API_URL}/api/users/profile/${user.id}`)
        .then((res) => setForm({ ...res.data, password: "" }))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://${process.env.REACT_APP_API_URL}/api/users/profile/${user.id}`, form);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Profile</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password (leave blank to keep same)</label>
          <input
            className="form-control"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
{/* 
        <div className="mb-3">
          <strong>Login Time:</strong> {form.login_time || "—"} <br />
          <strong>Logout Time:</strong> {form.logout_time || "—"}
        </div> */}

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>

          {/* ✅ Button to go to Admin Dashboard */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/admin")}
          >
            Admin Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
