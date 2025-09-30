const express = require("express");
const multer = require("multer");
const pool = require("../db"); // your DB connection

const router = express.Router();

// ✅ Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Upload endpoint
router.post("/", upload.single("file"), async (req, res) => {
  const { employeeId, taskId } = req.body;
  const file = req.file;

  console.log("➡️ Received upload:", { employeeId, taskId, file });

  if (!employeeId || !taskId || !file) {
    return res.status(400).json({ error: "Missing required fields or file" });
  }

  try {
    const conn = await pool.getConnection();
    console.log("✅ DB connected");

    const query = `
      INSERT INTO uploaded_files
      (employee_id, task_id, filename, filepath, mimetype, size, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const params = [
      employeeId,
      taskId,
      file.originalname,
      file.path,
      file.mimetype,
      file.size,
    ];

    await conn.query(query, params);
    conn.release();

    console.log("✅ File info saved to DB");
    res.json({ message: "File uploaded successfully", file: file.path });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Failed to save file info to database", details: err.message });
  }
});


module.exports = router;
