const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();
const SECRET = "secretkey"; // change for production

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // ✅ Generate hash properly
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
      [name, email, hashed, role]
    );

    res.json({ message: "User registered" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Save login time
    await pool.query("UPDATE users SET login_time = NOW() WHERE id = ?", [user.id]);

    res.json({
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query("UPDATE users SET logout_time = NOW() WHERE id=?", [id]);
    res.json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
