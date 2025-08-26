# Buni Money Tracker 💰

A beautiful and modern money tracking application built for couples to manage their shared finances. Built with the MERN stack (MongoDB, Express.js, React, Node.js) with a focus on user experience and beautiful design.

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing
- Protected routes

### 💳 Transaction Management
- Add, edit, and delete income and expenses
- Categorize transactions
- Add descriptions, locations, and tags
- Support for recurring transactions
- Multiple payment methods

### 📊 Analytics & Insights
- Real-time financial statistics
- Interactive charts and graphs
- Category-wise expense breakdown
- Income vs expense comparisons
- Transaction history with filtering

### 🎨 Modern UI/UX
- Responsive design for all devices
- Beautiful dashboard with charts
- Intuitive navigation
- Toast notifications
- Loading states and animations

### 🔍 Search & Filter
- Search transactions by description or category
- Filter by date ranges
- Category-based filtering
- Sort transactions by date

## 🚀 Quick Start (Single Command)

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup and Run

1. Install dependencies and set up environment:
   ```bash
   ./setup.sh
   ```

2. Start both backend and frontend with one command from project root:
   ```bash
   npm run dev
   ```

3. Open your browser:
   ```
   Frontend: http://localhost:5173
   Backend:  http://localhost:8000/api/hello
   ```

## 📁 Project Structure

```
buni-money-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── package.json        # root (workspaces + dev script)
├── setup.sh            # installs and prepares .env
└── README.md
```

## 🛠️ Tech Stack

### Backend
- Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, CORS

### Frontend
- React, Vite, Tailwind CSS, React Router, Recharts, React Hot Toast, Axios, React Icons

## 🔧 API Endpoints

### Authentication
- POST /api/auth/register — User registration
- POST /api/auth/login — User login
- GET /api/auth/me — Get current user
- PUT /api/auth/profile — Update profile
- PUT /api/auth/change-password — Change password

### Transactions
- GET /api/transactions — Get all transactions
- POST /api/transactions — Create transaction
- GET /api/transactions/:id — Get single transaction
- PUT /api/transactions/:id — Update transaction
- DELETE /api/transactions/:id — Delete transaction
- GET /api/transactions/stats — Get statistics
- GET /api/transactions/categories/list — Get categories

## 🎯 Key Features for Couples

- Shared financial visibility
- Smart categorization and tags
- Visual insights and summaries
- Quick add and management

## 🚀 Deployment

- Backend: Deploy Node/Express, set env vars, allow CORS
- Frontend: Build with `npm run build` and deploy to Vercel/Netlify

## 📝 License

MIT

---

Happy tracking! 💰✨
