@echo off
title UrbanAI - Climate-Adaptive Urban Digital Twin
echo.
echo =================================================================
echo  🚀 UrbanAI - Climate-Adaptive Urban Digital Twin
echo  🛰️ NASA Space Apps 2025 - Real Data Pipeline
echo =================================================================
echo.

REM Check if required directories exist
if not exist "backend" (
    echo ❌ Error: backend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Error: frontend directory not found  
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo 🔍 Checking dependencies...

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 16+
    pause  
    exit /b 1
)

echo ✅ Dependencies check passed
echo.
echo Starting backend and frontend servers...
echo.
echo 📡 Backend: http://localhost:5000
echo 🌍 Frontend: http://localhost:5173
echo.

REM Start backend in new command window
echo ⚡ Starting Python backend server...
start "UrbanAI Backend" cmd /k "cd /d "%~dp0backend" && python app.py"

REM Wait a moment for backend to start
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start frontend in new command window  
echo ⚡ Starting React frontend server...
start "UrbanAI Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

REM Wait for frontend to start
echo ⏳ Waiting for frontend to build...
timeout /t 8 /nobreak >nul

REM Open browser automatically
echo 🌐 Opening browser...
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173"

echo.
echo =================================================================
echo ✅ UrbanAI Digital Twin is now running!
echo.
echo 🎯 Main App: http://localhost:5173
echo 📊 Backend API: http://localhost:5000/api/health  
echo 🛰️ NASA Data: Real Earth Engine integration
echo 🤖 AI Engine: LMStudio local LLM (localhost:1234)
echo.
echo 📖 Full documentation: README.md
echo 🚨 Ensure LMStudio is running before analysis
echo.
echo 🎥 Demo: Upload GeoJSON → Run NASA Analysis → Switch Scenarios
echo.
echo Press any key to close this window (servers will keep running)
echo =================================================================
pause >nul