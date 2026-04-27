@echo off
chcp 65001 >nul
title 熊猫手护服务器测试
cd /d "%~dp0"
echo Starting server...
start /B cmd /c "node server.js > ..\server_log.txt 2>&1"
timeout /t 4 /nobreak >nul
echo Testing health...
curl -s -o nul -w "HTTP status: %%{http_code}%%\n" http://localhost:3001/api/health
pause
