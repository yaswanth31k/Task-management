import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`http://${process.env.REACT_APP_API_URL}/api/auth/login`, {
      email,
      password,
    });

    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(res.data));

    if (res.data.role === "admin") {
      navigate("/admin", { state: { user: res.data } });
    } else {
      navigate("/employee", { state: { user: res.data } });
    }
  } catch (err) {
    alert("Invalid credentials");
  }
};


  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        <div className="mt-3 text-center">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="btn btn-outline-secondary btn-sm">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;