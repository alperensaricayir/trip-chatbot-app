@echo off
setlocal
call "%~dp0\stop-prod.bat"
timeout /t 1 >nul
call "%~dp0\start-prod.bat"
