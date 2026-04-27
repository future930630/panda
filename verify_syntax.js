const fs = require('fs');
const vm = require('vm');

const base = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0';

['products-all.js', 'i18n.js', 'products-data.js'].forEach(file => {
  const path = base + '\\' + file;
  console.log('\n=== ' + file + ' ===');
  try {
    const code = fs.readFileSync(path, 'utf8');
    // Try to compile with Function constructor
    new Function(code);
    console.log('OK: No syntax errors');
  } catch (e) {
    console.log('ERROR: ' + e.message);
    // Show context
    const lines = code.split('\n');
    const m = e.message.match(/line (\d+)/);
    if (m) {
      const lineNum = parseInt(m[1]);
      const start = Math.max(0, lineNum - 3);
      const end = Math.min(lines.length, lineNum + 2);
      for (let i = start; i < end; i++) {
        console.log('  ' + (i+1) + ': ' + lines[i].substring(0, 120));
      }
    }
  }
});
