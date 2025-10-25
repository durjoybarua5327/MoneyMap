# MoneyMap

MoneyMap is a personal finance management web application that allows users to track budgets, expenses, and financial activities. It features a modern **Next.js** frontend with Tailwind CSS and a **Node.js + Express** backend with **MySQL** database support.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)

  * [Frontend](#frontend)
  * [Backend](#backend)
* [Database Setup](#database-setup)
* [Scripts](#scripts)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## Features

* User authentication with Clerk (`@clerk/nextjs`)
* Interactive dashboards and charts using Recharts
* Emoji support for transaction entries (`emoji-picker-react`)
* Calendar view for tracking expenses (`react-calendar`)
* Responsive and customizable UI with Tailwind CSS and Radix UI
* CRUD operations for budgets and transactions

---

## Tech Stack

**Frontend:**

* Next.js 16
* React 19
* Tailwind CSS 4
* Recharts, React Calendar, Heroicons, Lucide Icons
* Clerk for authentication
* Drizzle ORM for database integration

**Backend:**

* Node.js
* Express.js 5
* MySQL2
* CORS & dotenv for environment management

---

## Getting Started

### Frontend

1. Navigate to the frontend directory:

```bash
cd my-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example` (include Clerk credentials and database URL).

4. Run the development server:

```bash
npm run dev
```

The app should be accessible at `http://localhost:3000`.

---

### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=moneymap
PORT=5000
```

4. Start the server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`.

---

## Database Setup

1. Ensure MySQL is installed and running.
2. Create a database:

```sql
CREATE DATABASE moneymap;
```

3. Use Drizzle ORM to push migrations from the frontend:

```bash
cd my-app
npm run db:push
```

4. You can also explore the database using Drizzle Studio:

```bash
npm run db:studio
```

---

## Scripts

### Frontend

| Script              | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Starts the frontend in development mode |
| `npm run build`     | Builds the frontend for production      |
| `npm run start`     | Starts the production server            |
| `npm run db:push`   | Pushes database migrations              |
| `npm run db:studio` | Opens Drizzle Studio                    |

### Backend

| Script        | Description                            |
| ------------- | -------------------------------------- |
| `npm run dev` | Starts the backend server with nodemon |
| `npm start`   | Starts the backend server              |

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

This project is licensed under the **ISC License**.

---

## Contact

GitHub: [durjoybarua5327/MoneyMap](https://github.com/durjoybarua5327/MoneyMap)
Email: *(Add yo
