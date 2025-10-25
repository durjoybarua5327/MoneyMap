const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

let db;

async function initDB() {
  try {
    // 1️⃣ Connect without database to create it if needed
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database '${process.env.DB_NAME}' ready`);

    // 2️⃣ Connect to the actual database
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    console.log("✅ Connected to MySQL database!");

    // 3️⃣ Create budgets table
    await db.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        amount VARCHAR(50) NOT NULL,
        icon VARCHAR(100),
        created_by VARCHAR(255) NOT NULL,
        date DATE DEFAULT (CURRENT_DATE)
      );
    `);
    console.log("✅ Budgets table ready");

    // 4️⃣ Create expenses table
    await db.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        amount VARCHAR(50) NOT NULL,
        budgetId INT NOT NULL,
        created_by VARCHAR(255) NOT NULL,
        date DATE DEFAULT (CURRENT_DATE),
        FOREIGN KEY (budgetId) REFERENCES budgets(id) ON DELETE CASCADE
      );
    `);
    console.log("✅ Expenses table ready");

    return db;
  } catch (err) {
    console.error("❌ Database error:", err);
    process.exit(1);
  }
}

module.exports = initDB;
