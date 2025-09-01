# Buni Money Tracker 💰

A fully responsive and modern money tracking application built with the MERN stack (MongoDB, Express, React, Node.js). Track your income and expenses with beautiful charts, detailed analytics, and an intuitive user interface.

## ✨ Features

- **🔐 User Authentication** - Secure login and registration with JWT
- **💰 Income Tracking** - Add and manage income from various sources
- **💸 Expense Tracking** - Categorize and track your spending
- **📊 Interactive Dashboard** - Beautiful charts and financial overview
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **🎨 Modern UI** - Clean, intuitive interface with Tailwind CSS
- **📈 Real-time Analytics** - Live updates of your financial data
- **🗑️ Transaction Management** - Add, view, and delete transactions

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Upstash Redis (for production) or local development
- npm

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Buni-Money-Tracker
   ```

2. **Install dependencies and start the application**
   ```bash
   npm start
   ```
   
   This single command will:
   - Install all dependencies for both frontend and backend
   - Start the backend server on port 8000
   - Start the frontend development server on port 5173

3. **Access the application**
   - Frontend: http://localhost:5174 (or 5173)
   - Backend API: http://localhost:8000

## 🌐 Deployment

### Vercel Deployment (Recommended)
This app is configured for easy deployment to Vercel with Upstash Redis:

1. **Set up Upstash Redis** (if not already done)
2. **Deploy to Vercel** - See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for detailed instructions
3. **Configure environment variables** in Vercel dashboard

### Font Support
- **Local Development**: Uses system fonts (San Francisco on macOS)
- **Production**: Falls back to Inter font from Google Fonts
- **iOS Devices**: Native San Francisco fonts for authentic iOS look

### Manual Setup (Alternative)

If you prefer to run the servers separately:

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend/buni-money-tracker
npm install
npm run dev
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Beautiful charts and graphs
- **React Hot Toast** - Elegant notifications
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📱 Application Structure

```
Buni-Money-Tracker/
├── backend/                 # Node.js/Express backend
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
├── frontend/
│   └── buni-money-tracker/ # React frontend
│       ├── src/
│       │   ├── components/ # Reusable components
│       │   ├── pages/      # Page components
│       │   ├── utils/      # Utility functions
│       │   └── App.jsx     # Main app component
│       └── package.json    # Frontend dependencies
└── package.json            # Root package with scripts
```

## 🎯 Key Features Explained

### Dashboard
- **Financial Overview** - Total income, expenses, and balance
- **Interactive Charts** - Line charts for trends and pie charts for breakdowns
- **Recent Transactions** - Quick view of latest activities
- **Quick Actions** - Easy access to add income or expenses

### Income Management
- **Multiple Categories** - Salary, Freelance, Business, Investment, etc.
- **Transaction History** - View all income transactions
- **Real-time Updates** - Instant reflection of changes

### Expense Tracking
- **Categorized Spending** - Food, Transportation, Shopping, etc.
- **Detailed Records** - Amount, description, date, and category
- **Spending Analytics** - Visual representation of expenses

### Authentication
- **Secure Login** - JWT-based authentication
- **User Registration** - Create new accounts
- **Protected Routes** - Secure dashboard access

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/buni-money-tracker
JWT_SECRET=your-super-secret-jwt-key
PORT=8000
```

### MongoDB Setup
- **Local MongoDB**: Install MongoDB locally and ensure it's running
- **MongoDB Atlas**: Use a cloud MongoDB instance and update the connection string

## 📊 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Transactions
- `POST /api/transactions` - Add new transaction
- `GET /api/transactions` - Get user transactions
- `DELETE /api/transactions/:id` - Delete transaction

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Dark/Light Theme Ready** - Easy to extend with themes
- **Smooth Animations** - Enhanced user experience
- **Intuitive Navigation** - Easy-to-use sidebar navigation
- **Loading States** - Visual feedback during operations
- **Error Handling** - User-friendly error messages

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js and deploy

3. **Environment Variables**
   Set these in your Vercel dashboard:
   ```env
   NEXT_PUBLIC_API_URL=https://your-app-name.vercel.app
   UPSTASH_REDIS_REST_URL=your_redis_url_here
   UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=production
   ```

4. **Redis Setup**
   - Create a free Redis database on [Upstash](https://upstash.com/)
   - Add the Redis URL and token to Vercel environment variables

### Other Platforms
- **Netlify**: Similar process, but use `npm run build` and deploy the `.next` folder
- **Railway**: Connect GitHub and set environment variables
- **Heroku**: Use the Next.js buildpack

### Local Development
```bash
npm run dev
# Open http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🎉 Getting Started

1. Run `npm start` to launch the application
2. Open http://localhost:5173 in your browser
3. Create an account or login
4. Start tracking your money! 💰

---

**Happy Money Tracking!** 🎯
