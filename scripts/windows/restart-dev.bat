@echo off
setlocal
call "%~dp0\stop-dev.bat"
timeout /t 1 >nul
call "%~dp0\start-dev.bat"
