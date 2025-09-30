import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Profile from "./components/Profile";
import AssignTask from "./components/AssignTask";
import TaskProgress from "./components/TaskProgress";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/profile" element={<Profile/>} />
     <Route path="/assign-task" element={<AssignTask />} />
      <Route path="/progress" element={<TaskProgress />} />

    </Routes>
  );
}

export default App;
