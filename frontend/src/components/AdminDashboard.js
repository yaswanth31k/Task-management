// import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AppNavbar from "./Navbar";
// import { Spinner, Alert, Table, ProgressBar } from "react-bootstrap";

function AdminDashboard() {
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));

  // const [employees, setEmployees] = useState([]);
  // const [tasks, setTasks] = useState([]);
  // const [task, setTask] = useState({
  //   employee_id: "",
  //   task_title: "",
  //   task_desc: "",
  // });

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

  // // fetch employees
  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:5000/api/users/employees");
  //       setEmployees(res.data);
  //     } catch (err) {
  //       setError("Failed to load employees. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchEmployees();
  // }, []);

  // // fetch tasks (with progress info)
  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:5000/api/tasks");
  //       setTasks(res.data);
  //     } catch (err) {
  //       console.error("Error loading tasks", err);
  //     }
  //   };
  //   fetchTasks();
  // }, []);

  // const assignTask = async (e) => {
  //   e.preventDefault();

  //   if (!task.employee_id || !task.task_title || !task.task_desc) {
  //     alert("Please fill in all fields before assigning a task.");
  //     return;
  //   }

  //   try {
  //     await axios.post("http://localhost:5000/api/tasks/assign", task);
  //     alert("Task assigned successfully!");
  //     setTask({ employee_id: "", task_title: "", task_desc: "" });

  //     // refresh task list
  //     const res = await axios.get("http://localhost:5000/api/tasks");
  //     setTasks(res.data);
  //   } catch (err) {
  //     alert(err.response?.data?.error || "Error assigning task");
  //   }
  // };

  return (
    <div>
      {/* Navbar at top */}
      <AppNavbar user={user} />

      <div className="container mt-5">
        <h2>
          Welcome Admin <span className="text-primary">{user?.name || "Unknown"}</span>
        </h2>

      </div>
    </div>
  );
}

export default AdminDashboard;
