@echo off
setlocal
cd /d "%~dp0\..\.."
call npm run build
start "" cmd /c npm run start
