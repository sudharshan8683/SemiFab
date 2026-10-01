# FABSENSE All-in-One Launch Script
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Launching FABSENSE Application (Backend + Frontend)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Start-Process cmd.exe -ArgumentList "/k", "$scriptDir\run_backend.bat"

# Wait for backend initialization
Start-Sleep -Seconds 3

# Start Frontend
Start-Process cmd.exe -ArgumentList "/k", "$scriptDir\run_frontend.bat"

Write-Host "`nFABSENSE is launching:" -ForegroundColor Green
Write-Host "  - Backend API: http://localhost:8000" -ForegroundColor Yellow
Write-Host "  - API Swagger: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "  - Frontend UI: http://localhost:5173" -ForegroundColor Yellow
Write-Host "`nDefault Credentials:" -ForegroundColor Cyan
Write-Host "  - admin / admin123"
Write-Host "  - prod_mgr / prod123"
Write-Host "  - maint_eng / maint123"
Write-Host "  - qual_eng / qual123"
Write-Host "  - viewer / viewer123"
