@echo off
cd /d "%~dp0"
echo Instalando dependencias de Cine IUDigital...
call npm install
if errorlevel 1 exit /b 1
echo.
echo Panel: http://localhost:5173
echo API:   http://localhost:4000
echo.
call npm run dev
