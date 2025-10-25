const express = require('express');
const cors = require('cors');
const initDB = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let db;

initDB().then((connection) => {
  db = connection;

  /* ------------------ BUDGET ROUTES ------------------ */

  // Get budgets (filter by created_by if provided)
  app.get('/budgets', async (req, res) => {
    try {
      const { created_by } = req.query;
      let query = 'SELECT * FROM budgets';
      const params = [];

      if (created_by) {
        query += ' WHERE created_by = ?';
        params.push(created_by);
      }

      query += ' ORDER BY id DESC';
      const [results] = await db.query(query, params);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add a new budget
  app.post('/budgets', async (req, res) => {
    try {
      const { name, amount, icon, created_by } = req.body;
      const query =
        'INSERT INTO budgets (name, amount, icon, created_by) VALUES (?, ?, ?, ?)';
      const [result] = await db.query(query, [name, amount, icon, created_by]);
      res.json({ message: 'Budget added successfully', id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update a budget
  app.put('/budgets/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, amount, icon } = req.body;
      const query = 'UPDATE budgets SET name = ?, amount = ?, icon = ? WHERE id = ?';
      const [result] = await db.query(query, [name, amount, icon, id]);

      if (result.affectedRows === 0)
        return res.status(404).json({ message: 'Budget not found' });

      res.json({ message: 'Budget updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete budget + related expenses
  app.delete('/budgets/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM expenses WHERE budgetId = ?', [id]);
      const [result] = await db.query('DELETE FROM budgets WHERE id = ?', [id]);

      if (result.affectedRows === 0)
        return res.status(404).json({ message: 'Budget not found' });

      res.json({ message: 'Budget and related expenses deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /* ------------------ EXPENSE ROUTES ------------------ */

  // Get all expenses (filter by user)
  app.get('/expenses', async (req, res) => {
    try {
      const { created_by } = req.query;
      const query = `
        SELECT e.*, b.name AS budgetName, b.created_by AS budgetOwner
        FROM expenses e
        LEFT JOIN budgets b ON e.budgetId = b.id
        ORDER BY e.date DESC, e.id DESC
      `;
      const [results] = await db.query(query);

      if (created_by) {
        const filtered = results.filter(exp => exp.budgetOwner === created_by);
        return res.json(filtered);
      }

      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get expenses for a specific budget and user
  app.get('/expenses/:budgetId', async (req, res) => {
    try {
      const { budgetId } = req.params;
      const { created_by } = req.query; // logged-in user email

      if (!created_by)
        return res.status(400).json({ error: 'Missing created_by' });

      const query = `
        SELECT e.*, b.name AS budgetName, b.created_by AS budgetOwner
        FROM expenses e
        LEFT JOIN budgets b ON e.budgetId = b.id
        WHERE e.budgetId = ? AND b.created_by = ?
        ORDER BY e.date DESC, e.id DESC
      `;
      const [results] = await db.query(query, [budgetId, created_by]);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add a new expense
  app.post('/expenses', async (req, res) => {
    try {
      const { name, amount, budgetId, created_by } = req.body;
      if (!name || !amount || !budgetId || !created_by) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const query =
        'INSERT INTO expenses (name, amount, budgetId, created_by) VALUES (?, ?, ?, ?)';
      const [result] = await db.query(query, [name, amount, budgetId, created_by]);
      res.json({ message: 'Expense added successfully', id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete an expense + update budget
  app.delete('/expenses/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [results] = await db.query('SELECT * FROM expenses WHERE id = ?', [id]);

      if (results.length === 0)
        return res.status(404).json({ message: 'Expense not found' });

      const expense = results[0];
      const expenseAmount = parseFloat(expense.amount);
      const budgetId = expense.budgetId;

      await db.query('DELETE FROM expenses WHERE id = ?', [id]);
      await db.query('UPDATE budgets SET amount = amount + ? WHERE id = ?', [expenseAmount, budgetId]);

      res.json({ message: 'Expense deleted and budget updated' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /* ------------------ START SERVER ------------------ */
  app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
});
