# 💸 ExpenseTracker — AI-Powered Personal Finance Manager

A full-stack expense tracking application with AI-powered financial insights, built with Node.js, PostgreSQL, and React.

---

## 🚀 Live Demo

> Coming soon after deployment

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with bcrypt password hashing
- 💰 **Expense Management** — Add, view, and delete expenses by category
- 📊 **Visual Analytics** — Interactive pie chart showing spending breakdown by category
- 🎯 **Budget Tracking** — Set monthly salary and track remaining balance in real time
- 🤖 **AI Financial Insights** — Get personalized saving, investment, and spending advice powered by Groq LLM (Llama 3.3)

---

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- PostgreSQL (raw SQL, no ORM)
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing
- Groq SDK (Llama 3.3 70B) for AI insights

### Frontend
- React (Vite)
- Axios for API calls
- Chart.js + react-chartjs-2 for charts
- Custom CSS-in-JS dark theme UI

---

## 📁 Project Structure

```
Expense Tracker/
├── expanse-api/          # Express backend
│   ├── server.js         # All API routes
│   ├── db.js             # PostgreSQL connection
│   ├── migrate.js        # Database migrations
│   └── .env              # Environment variables (not committed)
│
└── expanse-tracker/      # React frontend
    └── src/
        ├── App.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            └── Dashboard.jsx
```

---

## 🗄️ Database Schema

```sql
users (id, name, email, password_hash, created_at)
expenses (id, user_id, title, amount, category, date, created_at)
budgets (id, user_id, monthly_salary, month, created_at)
```

---

## ⚙️ API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /register | Register new user | ❌ |
| POST | /login | Login and get JWT token | ❌ |
| GET | /expenses | Get all user expenses | ✅ |
| POST | /expenses | Add new expense | ✅ |
| DELETE | /expenses/:id | Delete expense | ✅ |
| GET | /budget | Get current month budget | ✅ |
| POST | /budget | Set monthly salary | ✅ |
| POST | /insights | Get AI financial insights | ✅ |

---

## 🏃 Running Locally

### Prerequisites
- Node.js v18+
- PostgreSQL 18

### Backend Setup

```bash
cd expanse-api
npm install
```

Create a `.env` file:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expensedb
JWT_SECRET=your_jwt_secret
GROQ_API=your_groq_api_key
```

Run database migrations:
```bash
node migrate.js
```

Start the server:
```bash
node server.js
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
cd expanse-tracker
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🤖 AI Insights

The AI insights feature uses **Groq's Llama 3.3 70B** model to analyze your spending data and provide:

- 📊 **Spending Analysis** — Pattern recognition across categories
- 💰 **Saving Strategy** — Specific monthly saving targets
- 📈 **Investment Advice** — SIP, mutual funds, FD recommendations based on your balance
- ⚠️ **Financial Warnings** — Identifies your biggest financial risks
- 🎯 **Action Plan** — 3 specific actions to take this week

All advice is tailored to Indian financial context (₹, SIP, PPF, Indian markets).

---

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/Screenshot_(40).png)

### AI Insights
![AI Insights](screenshots/insights.png)

---

## 👨‍💻 Author

**Harsh Pratap Singh**  
[GitHub](https://github.com/backendcrafter)

---

## 🔮 Future Improvements

- Export expenses as PDF/CSV
- Email alerts when budget exceeds limit
- Bank statement import
- Multi-currency support
- Mobile app (React Native)
