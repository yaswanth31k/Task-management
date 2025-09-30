const express = require("express");
const pool = require("../db");
const bcrypt = require("bcrypt");
const router = express.Router();

// Get all employees (Admin use)
router.get("/employees", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, email FROM users WHERE role='employee'");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get profile of logged-in user
router.put("/profile/:id", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let query, params;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      query = "UPDATE users SET name=?, email=?, password=? WHERE id=?";
      params = [name, email, hashed, req.params.id];
    } else {
      query = "UPDATE users SET name=?, email=? WHERE id=?";
      params = [name, email, req.params.id];
    }

    await pool.query(query, params);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.get("/update/:id", (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.params.id;

  const query = "UPDATE users SET name=?, email=?, password=? WHERE id=?";
  db.query(query, [name, email, password, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Profile updated successfully" });
  });
});



module.exports = router;
