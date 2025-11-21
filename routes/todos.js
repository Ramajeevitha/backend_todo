const express = require("express");

module.exports = (pool) => {
  const router = express.Router();


  router.get("/", async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM todos ORDER BY created_at DESC"
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const { title } = req.body;

      const result = await pool.query(
        "INSERT INTO todos (title) VALUES ($1) RETURNING *",
        [title]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  router.patch("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const oldTodo = await pool.query(
        "SELECT completed FROM todos WHERE id = $1",
        [id]
      );

      if (oldTodo.rowCount === 0)
        return res.status(404).json({ message: "Not found" });

      const current = oldTodo.rows[0].completed;
      const newValue =
        req.body.completed !== undefined ? req.body.completed : !current;

      const result = await pool.query(
        "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *",
        [newValue, id]
      );

      res.json(result.rows[0]);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  
  router.put("/:id", async (req, res) => {
    try {
      const { title } = req.body;
      const result = await pool.query(
        "UPDATE todos SET title = $1 WHERE id = $2 RETURNING *",
        [title, req.params.id]
      );

      if (result.rowCount === 0)
        return res.status(404).json({ message: "Not found" });

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  
  router.delete("/:id", async (req, res) => {
    try {
      const result = await pool.query(
        "DELETE FROM todos WHERE id = $1 RETURNING *",
        [req.params.id]
      );

      if (result.rowCount === 0)
        return res.status(404).json({ message: "Not found" });

      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};
