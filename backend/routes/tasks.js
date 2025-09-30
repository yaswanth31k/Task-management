const express = require("express");
const pool = require("../db");
const sendEmail = require("../utils/SendEmail");

const router = express.Router();

// Assign task
router.post("/assign", async (req, res) => {
  const { employee_ids, task_title, task_desc } = req.body;

  if (!Array.isArray(employee_ids) || employee_ids.length === 0) {
    return res.status(400).json({ error: "Please select at least one employee." });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const emailPromises = [];

    for (const employee_id of employee_ids) {
      await conn.query(
        `INSERT INTO tasks (employee_id, task_title, task_desc, status, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [employee_id, task_title, task_desc, "assigned"]
      );

      const [rows] = await conn.query(
        `SELECT email, name FROM users WHERE id = ?`,
        [employee_id]
      );
      const employee = rows[0];

      if (employee?.email) {
        emailPromises.push(
          sendEmail({
            to: employee.email,
            subject: "New Task Assigned",
            html: `
              <p>Hi ${employee.name},</p>
              <p>You have been assigned a new task:</p>
              <ul>
                <li><strong>Title:</strong> ${task_title}</li>
                <li><strong>Description:</strong> ${task_desc}</li>
              </ul>
              <p>Please log in to your dashboard to view and update the task.</p>
              <p>Regards,<br/>Task Manager Team</p>
            `,
          })
        );
      }
    }

    await conn.commit();
    await Promise.all(emailPromises);

    res.json({ message: "Task assigned and notifications sent." });
  } catch (err) {
    await conn.rollback();
    console.error("Error assigning task:", err);
    res.status(500).json({ error: err.message || "Failed to assign task" });
  } finally {
    conn.release();
  }
});

// Get tasks by employee
// Get tasks + uploaded files for an employee
router.get("/employee/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;

    // 1. Fetch tasks
    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE employee_id = ?",
      [employeeId]
    );

    // 2. Fetch uploaded files
    const [files] = await pool.query(
      "SELECT * FROM uploaded_files WHERE employee_id = ?",
      [employeeId]
    );
    // console.log("files is ",files);

    // 3. Attach files to tasks
    const tasksWithFiles = tasks.map((task) => {
      const taskFiles = files.filter((f) => f.task_id === task.id);
      return { ...task, files: taskFiles };
    });
    // console.log("taskwith files : ",tasksWithFiles);
    res.json(tasksWithFiles);
  } catch (err) {
    console.error("Error fetching tasks with files:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


// Update task (status + completed_at)
router.put("/update/:id", async (req, res) => {
  const { status } = req.body;
  const taskId = req.params.id;

  try {
    const [result] = await pool.query(
      "UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?",
      [status, status === "completed" ? new Date() : null, taskId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task updated", completed_at: status === "completed" ? new Date() : null });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

module.exports = router;
