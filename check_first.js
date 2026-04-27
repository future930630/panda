var fs = require('fs');
var path = 'c:/Users/Windows13/Desktop/2026.02.23广东-Robin/2026.03.13panda/各版本/20260331999999-2026.04.07-4.0/i18n.js';
var c = fs.readFileSync(path, 'utf8');
var lines = c.split('\n');

// Test: try lines 1-100
var snippet = lines.slice(0, 100).join('\n');
try {
    new Function(snippet);
    console.log('lines 1-100: OK');
} catch(e) {
    console.log('lines 1-100: ERROR - ' + e.message + ' at ' + e.lineNumber);
}

// Test: lines 100-300
snippet = lines.slice(100, 300).join('\n');
try {
    new Function(snippet);
    console.log('lines 100-300: OK');
} catch(e) {
    console.log('lines 100-300: ERROR - ' + e.message + ' at ' + e.lineNumber);
}

// Test: lines 300-500
snippet = lines.slice(300, 500).join('\n');
try {
    new Function(snippet);
    console.log('lines 300-500: OK');
} catch(e) {
    console.log('lines 300-500: ERROR - ' + e.message + ' at ' + e.lineNumber);
}

// Try with the full file but wrapped in a try-catch to get better line numbers
try {
    new Function(c);
} catch(e) {
    console.log('\nFull file error:', e.message, 'at line:', e.lineNumber);
    // Try to show the problematic line
    if (e.lineNumber && e.lineNumber > 0) {
        var lineIdx = e.lineNumber - 1;
        console.log('Problematic line:', lines[lineIdx]);
        console.log('Context:', JSON.stringify({
            'line-3': lines[lineIdx-3],
            'line-2': lines[lineIdx-2],
            'line-1': lines[lineIdx-1],
            'line': lines[lineIdx],
            'line+1': lines[lineIdx+1],
            'line+2': lines[lineIdx+2],
        }));
    }
}
