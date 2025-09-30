const express = require("express");
const mysql = require("mysql2/promise");

const router = express.Router();
const pool = mysql.createPool({ /* your DB config */ });

// Get all files for employee
router.get("/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT id, filename, uploaded_at FROM uploaded_files WHERE employee_id = ?",
      [employeeId]
    );
    res.json(rows);
  } catch (err) {
    console.error("DB fetch error:", err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// Download file
router.get("/download/:fileId", async (req, res) => {
  const { fileId } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM uploaded_files WHERE id = ?", [fileId]);
    if (rows.length === 0) return res.status(404).json({ error: "File not found" });

    const file = rows[0];
    res.setHeader("Content-Disposition", `attachment; filename=${file.filename}`);
    res.setHeader("Content-Type", file.mimetype);
    res.send(file.content);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Failed to download file" });
  }
});

module.exports = router;
