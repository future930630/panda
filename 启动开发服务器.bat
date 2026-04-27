@echo off
chcp 65001 >nul
title 熊猫手护 B2B 平台

echo ==========================================
echo   PandaShield B2B 电商平台
echo   端口: 3001
echo   访问: http://localhost:3001
echo ==========================================
echo.
echo 注意：此窗口保持打开，按 Ctrl+C 停止服务
echo.
cd /d "%~dp0serve_app"
node server.js
pause
