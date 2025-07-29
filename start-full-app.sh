#!/bin/bash

echo "🚀 Starting PayslipAI Full Application"
echo "======================================"

# Function to handle cleanup
cleanup() {
    echo "🛑 Shutting down services..."
    pkill -f "node server/index.js"
    pkill -f "npm run dev"
    exit
}

# Set trap to catch Ctrl+C and cleanup
trap cleanup SIGINT

echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

echo "🔧 Starting API Server on port 3001..."
cd server
npm run dev &
SERVER_PID=$!
cd ..

# Wait a moment for server to start
sleep 3

echo "⚛️  Starting React App on port 3002..."
npm run dev &
REACT_PID=$!

echo ""
echo "✅ Application started successfully!"
echo "======================================"
echo "🔗 React App: http://localhost:3002"
echo "🔗 API Server: http://localhost:3001"
echo "🔗 Health Check: http://localhost:3001/health"
echo ""
echo "💡 Make sure to configure your AI API keys in server/.env"
echo "📄 Copy server/.env.example to server/.env and add your keys"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for both processes
wait $SERVER_PID $REACT_PID 