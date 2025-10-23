const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ------------------ BUDGET ROUTES ------------------ */

// Get all budgets
app.get('/budgets', (req, res) => {
  db.query('SELECT * FROM budgets', (err, results) => {
    if (err) {
      console.error("Error fetching budgets:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Add a new budget
app.post('/budgets', (req, res) => {
  const { name, amount, icon, created_by } = req.body;
  const query = 'INSERT INTO budgets (name, amount, icon, created_by) VALUES (?, ?, ?, ?)';
  db.query(query, [name, amount, icon, created_by], (err, result) => {
    if (err) {
      console.error("Error adding budget:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Budget added', id: result.insertId });
  });
});

/* ------------------ EXPENSE ROUTES ------------------ */

// Get all expenses
app.get('/expenses', (req, res) => {
  db.query('SELECT * FROM expenses', (err, results) => {
    if (err) {
      console.error("Error fetching expenses:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Add a new expense
app.post('/expenses', (req, res) => {
  const { name, amount, budgetId, created_by } = req.body;
  const query = 'INSERT INTO expenses (name, amount, budgetId, created_by) VALUES (?, ?, ?, ?)';
  db.query(query, [name, amount, budgetId, created_by], (err, result) => {
    if (err) {
      console.error("Error adding expense:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Expense added', id: result.insertId });
  });
});

// Get expenses for a specific budget
app.get('/expenses/:budgetId', (req, res) => {
  const { budgetId } = req.params;
  db.query('SELECT * FROM expenses WHERE budgetId = ?', [budgetId], (err, results) => {
    if (err) {
      console.error("Error fetching expenses:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
