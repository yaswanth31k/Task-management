import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AppNavbar1 from "./Navbar1";
import "./dashboard.css";

function EmployeeDashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const raw = state?.user || JSON.parse(localStorage.getItem("user"));
  const user = raw
    ? { id: raw.id ?? raw._id, name: raw.name, email: raw.email }
    : null;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState({});
  const fileInputRefs = useRef({});

  useEffect(() => {
    if (!user?.id) {
      alert("User not found. Please log in again.");
      navigate("/");
      return;
    }

    axios
      .get(`http://${process.env.REACT_APP_API_URL}/api/tasks/employee/${user.id}`)
      .then((res) => setTasks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const updateTask = async (taskId, status) => {
    try {
      const response = await axios.put(
        `http://${process.env.REACT_APP_API_URL}/api/tasks/update/${taskId}`,
        { status }
      );

      if (response.status === 200) {
        const updatedTasks = tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status,
                completed_at:
                  status === "completed" ? new Date().toISOString() : null,
              }
            : task
        );
        setTasks(updatedTasks);
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("Axios error:", error.response?.data || error.message);
      alert("Update failed");
    }
  };

  const handleFileUpload = async (taskId) => {
    const file = fileInputRefs.current[taskId]?.files?.[0];
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("employeeId", user.id);
    formData.append("taskId", taskId);

    try {
      const res = await axios.post("http://${process.env.REACT_APP_API_URL}/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message || "File uploaded");
      setUploadStatus((prev) => ({ ...prev, [taskId]: true }));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  const assignedTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks
    .filter((t) => t.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.completed_at || b.created_at) -
        new Date(a.completed_at || a.created_at)
    );

  const formatDateTime = (dt) => new Date(dt).toLocaleString();

  return (
    <div>
      <AppNavbar1 user={user} />
      <div className="container mt-5">
        <h2>
          Welcome <span className="text-primary">{user?.name || "Unknown"}</span>
        </h2>

        {loading ? (
          <p>Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <div className="alert alert-info">No tasks assigned yet.</div>
        ) : (
          <>
            {/* Assigned Tasks Table */}
            <h4 className="mt-4">📝 Assigned Tasks</h4>
            {assignedTasks.length === 0 ? (
              <div className="alert alert-secondary">No active tasks.</div>
            ) : (
              <div className="table-responsive mb-4">
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Task Title</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Upload File</th>
                      <th>State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedTasks.map((t) => (
                      <tr key={t.id}>
                        <td>{t.task_title}</td>
                        <td>{t.status}</td>
                        <td>{formatDateTime(t.created_at)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <input
                              type="file"
                              ref={(el) => (fileInputRefs.current[t.id] = el)}
                              className="form-control form-control-sm me-2"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) console.log("Selected file:", file.name);
                              }}
                            />
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleFileUpload(t.id)}
                            >
                              Upload
                            </button>
                          </div>
                          {fileInputRefs.current[t.id]?.files?.[0] && (
                            <small className="text-muted d-block mt-1">
                              Selected: {fileInputRefs.current[t.id].files[0].name}
                            </small>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => updateTask(t.id, "in_progress")}
                          >
                            In Progress
                          </button>
                          <button
                            className="btn btn-success btn-sm"
                            disabled={!uploadStatus[t.id]}
                            onClick={() => updateTask(t.id, "completed")}
                          >
                            Completed
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Completed Tasks Table */}
            <h4 className="mt-4">✅ Completed Tasks</h4>
            {completedTasks.length === 0 ? (
              <div className="alert alert-secondary">No completed tasks yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Task Title</th>
                      <th>Status</th>
                      <th>Assigned At</th>
                      <th>Completed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedTasks.map((t) => (
                      <tr key={t.id}>
                        <td>{t.task_title}</td>
                        <td>
                          <span className="badge bg-success">{t.status}</span>
                        </td>
                        <td>{formatDateTime(t.created_at)}</td>
                        <td>
                          {t.completed_at
                            ? formatDateTime(t.completed_at)
                            : "Not recorded"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;