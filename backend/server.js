// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ------------------ BUDGET ROUTES ------------------ */

// ✅ Get all budgets
app.get('/budgets', (req, res) => {
  db.query('SELECT * FROM budgets ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Add a new budget
app.post('/budgets', (req, res) => {
  const { name, amount, icon, created_by } = req.body;
  const query = 'INSERT INTO budgets (name, amount, icon, created_by) VALUES (?, ?, ?, ?)';
  db.query(query, [name, amount, icon, created_by], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Budget added', id: result.insertId });
  });
});

/* ------------------ EXPENSE ROUTES ------------------ */

// ✅ Get all expenses (newest → oldest)
app.get('/expenses', (req, res) => {
  const query = 'SELECT * FROM expenses ORDER BY date DESC, id DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Get expenses by specific budget (newest → oldest)
app.get('/expenses/:budgetId', (req, res) => {
  const { budgetId } = req.params;
  const query = 'SELECT * FROM expenses WHERE budgetId = ? ORDER BY date DESC, id DESC';
  db.query(query, [budgetId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Add a new expense
app.post('/expenses', (req, res) => {
  const { name, amount, budgetId, created_by } = req.body;
  const query = 'INSERT INTO expenses (name, amount, budgetId, created_by) VALUES (?, ?, ?, ?)';
  db.query(query, [name, amount, budgetId, created_by], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Expense added', id: result.insertId });
  });
});

// ✅ DELETE expense and update budget
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;

  // 1️⃣ Get the expense details first
  db.query('SELECT * FROM expenses WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Expense not found' });

    const expense = results[0];
    const expenseAmount = parseFloat(expense.amount);
    const budgetId = expense.budgetId;

    // 2️⃣ Delete the expense
    db.query('DELETE FROM expenses WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // 3️⃣ Update the related budget amount
      db.query('UPDATE budgets SET amount = amount + ? WHERE id = ?', [expenseAmount, budgetId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Expense deleted and budget updated' });
      });
    });
  });
});

// ✅ Server listen
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
