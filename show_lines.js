const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Windows13/Desktop/2026.02.23广东-Robin/2026.03.13panda/各版本/20260331999999-2026.04.07-4.0/i18n.js', 'utf8').split('\n');
for (let i = 1620; i <= 1645; i++) {
  console.log(i+1, JSON.stringify(lines[i]));
}
