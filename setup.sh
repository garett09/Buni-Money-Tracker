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

# Install all workspaces
echo "📦 Installing dependencies for all workspaces..."
npm install

# Create backend .env if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env file..."
    cat > backend/.env << EOF
PORT=8000
MONGODB_URI=mongodb://localhost:27017/buni-money-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
EOF
    echo "✅ Created backend/.env file"
else
    echo "✅ backend/.env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Run the app with one command:"
echo "   npm run dev"