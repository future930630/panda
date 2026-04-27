@echo off
chcp 65001 >nul
cd /d "%~dp0"
start /B node server.js > nul 2>&1
echo Server starting on port 3001...
