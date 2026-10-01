@echo off
title FABSENSE Frontend UI
cd /d "%~dp0frontend"

echo ========================================================
echo   Starting FABSENSE Frontend (Vite)
echo ========================================================

IF NOT EXIST "node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install
)

echo [INFO] Launching Vite development server...
call npm run dev
pause
