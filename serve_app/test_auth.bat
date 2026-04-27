@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 启动 PandaShield API 服务器 on port 3001...
start /B node server.js
timeout /t 3 /nobreak >nul
curl -s -o nul -w "%%{http_code}" http://localhost:3001/api/health
