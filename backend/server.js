const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

// Middleware
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
  const query =
    'INSERT INTO budgets (name, amount, icon, created_by) VALUES (?, ?, ?, ?)';
  db.query(query, [name, amount, icon, created_by], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Budget added successfully', id: result.insertId });
  });
});

// ✅ Update an existing budget (edit name, icon, or amount)
app.put('/budgets/:id', (req, res) => {
  const { id } = req.params;
  const { name, amount, icon } = req.body;

  const query = 'UPDATE budgets SET name = ?, amount = ?, icon = ? WHERE id = ?';
  db.query(query, [name, amount, icon, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget updated successfully' });
  });
});

// ✅ DELETE budget and its related expenses
app.delete('/budgets/:id', (req, res) => {
  const { id } = req.params;

  // 1️⃣ Delete all expenses related to the budget
  db.query('DELETE FROM expenses WHERE budgetId = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // 2️⃣ Delete the budget itself
    db.query('DELETE FROM budgets WHERE id = ?', [id], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Budget not found' });
      }

      res.json({ message: 'Budget and its expenses deleted successfully' });
    });
  });
});

/* ------------------ EXPENSE ROUTES ------------------ */

// ✅ Get all expenses with budget name
app.get('/expenses', (req, res) => {
  const query = `
    SELECT e.*, b.name AS budgetName
    FROM expenses e
    LEFT JOIN budgets b ON e.budgetId = b.id
    ORDER BY e.date DESC, e.id DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Get expenses by specific budget with budget name
app.get('/expenses/:budgetId', (req, res) => {
  const { budgetId } = req.params;
  const query = `
    SELECT e.*, b.name AS budgetName
    FROM expenses e
    LEFT JOIN budgets b ON e.budgetId = b.id
    WHERE e.budgetId = ?
    ORDER BY e.date DESC, e.id DESC
  `;
  db.query(query, [budgetId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Add a new expense
app.post('/expenses', (req, res) => {
  const { name, amount, budgetId, created_by } = req.body;
  const query =
    'INSERT INTO expenses (name, amount, budgetId, created_by) VALUES (?, ?, ?, ?)';
  db.query(query, [name, amount, budgetId, created_by], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Expense added successfully', id: result.insertId });
  });
});

// ✅ DELETE expense and update budget amount
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM expenses WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: 'Expense not found' });

    const expense = results[0];
    const expenseAmount = parseFloat(expense.amount);
    const budgetId = expense.budgetId;

    // Delete expense
    db.query('DELETE FROM expenses WHERE id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      // Update related budget
      db.query(
        'UPDATE budgets SET amount = amount + ? WHERE id = ?',
        [expenseAmount, budgetId],
        (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ message: 'Expense deleted and budget updated' });
        }
      );
    });
  });
});

/* ------------------ START SERVER ------------------ */
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
