const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// ✅ Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add a new todo
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    const todo = new Todo({ title });
    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Toggle completion (mark done/undone)
router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Not found' });

    todo.completed =
      req.body.completed !== undefined ? req.body.completed : !todo.completed;

    const updated = await todo.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Edit/Update todo title
router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true } // return the updated document
    );

    if (!updatedTodo) return res.status(404).json({ message: 'Not found' });

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Todo.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
