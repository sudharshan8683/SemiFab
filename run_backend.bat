@echo off
title FABSENSE Backend API
cd /d "%~dp0backend"

echo ========================================================
echo   Starting FABSENSE Backend Server
echo ========================================================

IF EXIST "venv\Scripts\activate.bat" (
    echo [INFO] Activating backend\venv...
    call venv\Scripts\activate.bat
) ELSE IF EXIST "..\.venv\Scripts\activate.bat" (
    echo [INFO] Activating root .venv...
    call ..\.venv\Scripts\activate.bat
) ELSE (
    echo [INFO] venv not found, using system Python...
)

echo [INFO] Ensuring required backend packages are installed...
python -m pip install -r requirements.txt

echo [INFO] Launching FastAPI on http://127.0.0.1:8000 ...
python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
pause
