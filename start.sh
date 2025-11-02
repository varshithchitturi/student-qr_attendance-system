#!/bin/bash

echo "🎓 College QR Attendance System Setup"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: brew services start mongodb/brew/mongodb-community"
fi

echo "📦 Installing dependencies..."
npm run install-all

echo "🗄️  Setting up database with demo data..."
npm run setup

echo "🚀 Starting the application..."
echo "   Backend will run on: http://localhost:5000"
echo "   Frontend will run on: http://localhost:3000"
echo ""
echo "Demo Credentials:"
echo "   Admin: admin/admin123"
echo "   Faculty: faculty/faculty123" 
echo "   Student: student/student123"
echo ""

npm run dev