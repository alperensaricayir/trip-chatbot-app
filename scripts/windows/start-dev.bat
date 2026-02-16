@echo off
setlocal
cd /d "%~dp0\..\.."
start "" cmd /c npm run dev
