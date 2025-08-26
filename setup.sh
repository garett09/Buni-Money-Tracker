#!/bin/bash

echo "🚀 Setting up Buni Money Tracker..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=8000
MONGODB_URI=mongodb://localhost:27017/buni-money-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend/buni-money-tracker

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

cd ../..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running locally or update the MONGODB_URI in backend/.env"
echo "2. Start the backend server:"
echo "   cd backend && npm start"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend/buni-money-tracker && npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "Happy tracking! 💰✨"