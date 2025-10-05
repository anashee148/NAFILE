@echo off
title UrbanClimate Digital Twin - Space Apps 2025
echo.
echo =================================================================
echo  🚀 UrbanClimate Digital Twin - NASA Earth Engine + Local AI
echo =================================================================
echo.
echo Starting backend and frontend servers...
echo.
echo 📡 Backend: http://localhost:5000
echo 🌍 Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in any window to stop all servers
echo.

REM Start backend in new command window
echo ⚡ Starting Python backend server...
start "UrbanClimate Backend" cmd /k "cd /d "%~dp0backend" && python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new command window  
echo ⚡ Starting React frontend server...
start "UrbanClimate Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

REM Wait for frontend to start
timeout /t 5 /nobreak >nul

REM Open browser automatically
echo 🌐 Opening browser...
start "" "http://localhost:5173"

echo.
echo =================================================================
echo ✅ UrbanClimate Digital Twin is now running!
echo.
echo 🎯 Main App: http://localhost:5173
echo 📊 Backend API: http://localhost:5000/api/health
echo 🛰️ NASA Data: Real Earth Engine integration
echo 🤖 AI Engine: LMStudio local LLM
echo.
echo 📖 Check README.md for full documentation
echo 🚨 Ensure LMStudio is running on localhost:1234
echo.
echo Press any key to close this window (servers will keep running)
echo =================================================================
pause >nul