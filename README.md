# Vaultline — Personal Finance Advisor

A full-stack personal finance advisor web application with a private-ledger, "Luxury Minimal" black-and-gold design. Built as a college major project with React (Vite) on the frontend and Node.js + Express + MongoDB on the backend.

## What's inside

- **Authentication** — register, login, JWT-protected routes, profile & password management
- **Dashboard** — balance, income/expense summary cards, income-vs-expense trend chart, category breakdown, recent transactions, budget overview
- **Transactions** — full CRUD, search, filter by type/category, sort, pagination
- **Budget Planner** — set monthly limits per category with live spend tracking and status (healthy/warning/over)
- **Savings Goals** — create goals, contribute funds, track progress, auto-complete on reaching target
- **Loan & EMI Calculator** — reducing-balance EMI formula, full amortization schedule, save loans for tracking
- **Reports & Insights** — 12-month trends, savings rate, category breakdowns
- **Settings** — profile, currency, avatar color, password change

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, React Router, Recharts, Lucide Icons, react-hot-toast, Axios |
| Backend | Node.js, Express.js, JWT, bcryptjs |
| Database | MongoDB with Mongoose |

No Tailwind/UI kit is used — the interface is built with a hand-rolled design token system (see `client/src/styles/tokens.css`) to keep the "Luxury Minimal" black-and-gold identity distinctive.

## Project structure

```
finance-advisor/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── assets/
│       ├── components/     # common, layout, dashboard, transactions, budget, goals, loan, auth
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── services/       # axios API wrappers
│       ├── utils/
│       ├── styles/         # design tokens + component/page CSS
│       ├── context/        # AuthContext
│       └── routes/
└── server/                 # Node.js + Express backend
    ├── config/              # MongoDB connection
    ├── controllers/
    ├── models/              # User, Transaction, Budget, Goal, Loan
    ├── routes/
    ├── middleware/          # auth + error handling
    ├── utils/
    └── server.js
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB instance — either local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend setup

```bash
cd server
cp .env.example .env
# edit .env and set MONGO_URI, JWT_SECRET, etc.
npm install
npm run dev
```

The API will run on `http://localhost:5000` by default. Visit `http://localhost:5000/api/health` to confirm it's running.

### 2. Frontend setup

In a separate terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The app will run on `http://localhost:5173`.

### 3. Use the app

Open `http://localhost:5173`, create an account, and start logging transactions.

## Environment variables

**server/.env**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance_advisor
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Notes

- Amounts are stored in raw numeric form; currency symbol is applied client-side based on the user's chosen currency in Settings.
- The EMI calculator uses the standard reducing-balance formula: `EMI = P × r × (1+r)^n / ((1+r)^n − 1)`.
- Budgets are scoped per month (`YYYY-MM`) and category, and compute "spent" live from transactions in that category/month.
