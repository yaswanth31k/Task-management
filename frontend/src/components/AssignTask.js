import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Alert } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import AppNavbar from "./Navbar";
import "./dashboard.css";

function AssignTask() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [employees, setEmployees] = useState([]);
  const [task, setTask] = useState({
    employee_ids: [],
    task_title: "",
    task_desc: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`http://${process.env.REACT_APP_API_URL}/api/users/employees`);
        console.log("Employees from API:", res.data); // 👀 check structure
        setEmployees(res.data);
      } catch (err) {
        setError("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);


  const assignTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://${process.env.REACT_APP_API_URL}/api/tasks/assign`, task);
      console.log("data of task",task);
      alert("Task assigned successfully!");
      setTask({ employee_ids: [], task_title: "", task_desc: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Error assigning task");
    }
  };

  return (
    <div>
      <AppNavbar user={user} />
      <div className="container mt-5">
        <h2>Assign Task</h2>
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <form onSubmit={assignTask}>
            <div className="mb-3">
              <label>Employees</label>
              <Typeahead
                id="employee-search"
                labelKey="name"
                multiple
                options={employees}
                placeholder="Search and select employees..."
                onChange={(selected) =>
                  setTask({
                    ...task,
                    employee_ids: selected.map((emp) => emp.id)

                  })
                }
                selected={
                  Array.isArray(task.employee_ids)
                    ? employees.filter((emp) =>
                      task.employee_ids.includes(emp.id)
                    )
                    : []
                }
              />
              <small className="text-muted">
                You can select multiple employees by typing and clicking.
              </small>
            </div>
            <div className="mb-3">
              <label>Task Title</label>
              <input
                type="text"
                className="form-control"
                value={task.task_title}
                onChange={(e) => setTask({ ...task, task_title: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label>Task Description</label>
              <textarea
                className="form-control"
                value={task.task_desc}
                onChange={(e) => setTask({ ...task, task_desc: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Assign</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AssignTask;