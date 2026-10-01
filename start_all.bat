@echo off
title FABSENSE Launcher
cd /d "%~dp0"

echo ========================================================
echo   Launching FABSENSE (Backend + Frontend)
echo ========================================================

start "FABSENSE Backend" cmd /k "run_backend.bat"
timeout /t 3 /nobreak >nul
start "FABSENSE Frontend" cmd /k "run_frontend.bat"

echo App services launched in separate windows!
echo - Backend:  http://localhost:8000 (Docs: http://localhost:8000/docs)
echo - Frontend: http://localhost:5173
echo.
