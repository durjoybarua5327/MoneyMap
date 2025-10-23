const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

// Create budgets table if not exists
const createBudgetsTableQuery = `
CREATE TABLE IF NOT EXISTS budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  amount VARCHAR(50) NOT NULL,
  icon VARCHAR(100),
  created_by VARCHAR(255) NOT NULL
);
`;

db.query(createBudgetsTableQuery, (err, result) => {
  if (err) {
    console.error("Error creating budgets table:", err);
  } else {
    console.log("Budgets table created or already exists");
  }
});

// Create expenses table if not exists
const createExpensesTableQuery = `
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  amount VARCHAR(50) NOT NULL,
  budgetId INT NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  FOREIGN KEY (budgetId) REFERENCES budgets(id) ON DELETE CASCADE
);
`;

db.query(createExpensesTableQuery, (err, result) => {
  if (err) {
    console.error("Error creating expenses table:", err);
  } else {
    console.log("Expenses table created or already exists");
  }
});

module.exports = db;
