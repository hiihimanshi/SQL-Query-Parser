#!/bin/bash

echo "🚀 Setting up Query-Master..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✓ Node.js $(node --version) found"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm $(npm --version) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p data
mkdir -p logs
mkdir -p schemas

# Copy .env if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file from .env.example..."
    cp .env.example .env
else
    echo "✓ .env file already exists"
fi

# Run tests
echo ""
echo "🧪 Running tests..."
npm test -- --passWithNoTests 2>/dev/null

# Success message
echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. npm start      - Run interactive CLI"
echo "  2. npm run dev    - Run with debug mode"
echo "  3. npm test       - Run tests"
echo "  4. npm run lint   - Check code"
echo ""
echo "📚 For more info: npm run --help"
echo ""
