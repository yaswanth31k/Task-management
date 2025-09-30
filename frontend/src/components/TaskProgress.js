import React, { useEffect, useState } from "react";
import axios from "axios";
import AppNavbar from "./Navbar";
import "./dashboard.css";

function TasksProgress() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [tasks, setTasks] = useState([]);

  // Fetch employees once
  useEffect(() => {
    axios
      .get(`http://${process.env.REACT_APP_API_URL}/api/users/employees`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const getStatusClass = (status) => {
    const normalized = status.toLowerCase();
    if (normalized === "completed") return "text-success";
    if (normalized === "in_progress") return "text-warning";
    if (normalized === "assigned") return "text-danger";
    return "";
  };

  // Fetch tasks when employee changes
  useEffect(() => {
    if (!selectedEmployee) {
      setTasks([]);
      return;
    }
    axios
      .get(`http://${process.env.REACT_APP_API_URL}/api/tasks/employee/${selectedEmployee}`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [selectedEmployee]);

  return (
    <div>
      <AppNavbar />
      <div className="container mt-5">
        <h2>Employee Task Status</h2>

        {/* Employee dropdown */}
        <select
          className="form-control my-3"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">-- Select Employee --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>

        {/* Task details */}
        {selectedEmployee && (
          <>
            <h4 className="mt-3">Tasks</h4>
            <h6>Total Tasks: {tasks.length}</h6>

            {tasks.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="thead-dark">
                    <tr>
                      <th>Task ID</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Uploaded Files</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>{task.task_title}</td>
                        <td>{task.task_desc}</td>
                        <td className={getStatusClass(task.status)}>
                          {task.status}
                        </td>
                        <td>
                          {task.files && task.files.length > 0 ? (
                            <ul className="list-unstyled mb-0">
                              {task.files.map((file) => (
                                <li key={file.id}>
                                  <a
                                    href={`http://localhost:5000${file.filepath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {file.filename}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-muted">No files uploaded</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No tasks found for this employee.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TasksProgress;