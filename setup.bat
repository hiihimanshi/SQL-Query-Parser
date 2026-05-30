@echo off
echo.
echo 🚀 Setting up Query-Master...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% found

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✓ npm %NPM_VERSION% found

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

REM Create necessary directories
echo.
echo 📁 Creating directories...
if not exist "data" mkdir data
if not exist "logs" mkdir logs
if not exist "schemas" mkdir schemas

REM Copy .env if it doesn't exist
if not exist ".env" (
    echo ⚙️  Creating .env file from .env.example...
    copy .env.example .env
) else (
    echo ✓ .env file already exists
)

REM Success message
echo.
echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo   1. npm start      - Run interactive CLI
echo   2. npm run dev    - Run with debug mode
echo   3. npm test       - Run tests
echo   4. npm run lint   - Check code
echo.
echo 📚 For more info: npm run --help
echo.
pause
