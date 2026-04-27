@echo off
chcp 65001 >nul
cd /d "C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0"
"C:\Program Files\nodejs\node.exe" -e "try{var fs=require('fs');var c=fs.readFileSync('i18n.js','utf8');new Function(c);console.log('i18n.js: OK - syntax valid');}catch(e){console.error('i18n.js ERROR:', e.message,'at line:',e.lineNumber);}"
