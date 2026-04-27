var fs = require('fs');
var path = 'c:/Users/Windows13/Desktop/2026.02.23广东-Robin/2026.03.13panda/各版本/20260331999999-2026.04.07-4.0/products-data.js';
var c = fs.readFileSync(path, 'utf8');
try {
  eval(c);
  console.log('OK - products: ' + (typeof window !== 'undefined' && window.__PANDA_PRODUCTS__ ? window.__PANDA_PRODUCTS__.length : 'N/A'));
} catch(e) {
  console.error('ERROR: ' + e.message);
  console.error('Line: ' + e.lineNumber);
}
