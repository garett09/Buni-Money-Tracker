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

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/buni-money-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/buni-money-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:5173
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
│   └── buni-money-tracker/
│       ├── src/
│       │   ├── components/
│       │   │   ├── common/
│       │   │   ├── dashboard/
│       │   │   └── layouts/
│       │   ├── contexts/
│       │   ├── pages/
│       │   ├── utils/
│       │   └── App.jsx
│       └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Charts and graphs
- **React Hot Toast** - Notifications
- **Axios** - HTTP client
- **React Icons** - Icon library

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get statistics
- `GET /api/transactions/categories/list` - Get categories

## 🎯 Key Features for Couples

### Shared Financial Visibility
- Both partners can see all transactions
- Real-time balance updates
- Shared expense tracking

### Smart Categorization
- Pre-defined categories for common expenses
- Custom tags for better organization
- Location tracking for transactions

### Financial Insights
- Visual charts showing spending patterns
- Category-wise expense breakdown
- Monthly/yearly financial summaries

### Easy Management
- Quick add transactions
- Bulk operations
- Search and filter capabilities
- Export functionality (coming soon)

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Update environment variables
4. Set up CORS for your frontend domain

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages
3. Update API endpoints to point to your backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with love for couples managing their finances together
- Inspired by modern fintech applications
- Special thanks to the open-source community

---

**Happy tracking! 💰✨**
