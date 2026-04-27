@echo off
chcp 65001 >nul
cd /d "C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0"
"C:\Program Files\nodejs\node.exe" -e "try{var fs=require('fs');var c=fs.readFileSync('products-data.js','utf8');eval(c);console.log('products-data.js: OK');console.log('Products:', window.__PANDA_PRODUCTS__.length);console.log('Last SKU:', window.__PANDA_PRODUCTS__[99].sku);}catch(e){console.error('ERROR:',e.message);}"
