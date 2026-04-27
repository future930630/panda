var fs = require('fs');
var path = 'c:/Users/Windows13/Desktop/2026.02.23广东-Robin/2026.03.13panda/各版本/20260331999999-2026.04.07-4.0/i18n.js';
var c = fs.readFileSync(path, 'utf8');
var lines = c.split('\n');

// Binary search: try ranges to find error
// First try: last 1000 lines
function testRange(start, end, label) {
    var snippet = lines.slice(start, end).join('\n');
    try {
        new Function(snippet);
        console.log(label + ': OK');
        return true;
    } catch(e) {
        console.log(label + ': ERROR - ' + e.message + ' (line in snippet ~' + (e.lineNumber || '?') + ')');
        return false;
    }
}

// Test ranges
testRange(0, 500, 'lines 1-500');
testRange(500, 1000, 'lines 500-1000');
testRange(1000, 1500, 'lines 1000-1500');
testRange(1500, 2000, 'lines 1500-2000');
testRange(2000, 2500, 'lines 2000-2500');
testRange(2500, 3000, 'lines 2500-3000');
testRange(3000, 3500, 'lines 3000-3500');
testRange(3500, 4000, 'lines 3500-4000');
testRange(4000, 4500, 'lines 4000-4500');
testRange(4500, 4891, 'lines 4500-4891');
