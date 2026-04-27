var fs = require('fs');
var vm = require('vm');

var path = 'c:/Users/Windows13/Desktop/2026.02.23广东-Robin/2026.03.13panda/各版本/20260331999999-2026.04.07-4.0/i18n.js';
var c = fs.readFileSync(path, 'utf8');
var lines = c.split('\n');

// Try to find the specific const problem
// Look for: const followed by space, then letters, then colon
// i.e., const FOOBAR: which is invalid JS (should be const FOOBAR = ...)
for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var stripped = line.trim();
    // Match: const IDENT: ...  (colon after identifier, no equals)
    // Valid: const IDENT = ...
    var m = stripped.match(/^const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*/);
    if (m) {
        console.log('FOUND at line', i+1, ':', line.substring(0, 120));
    }
    // Also match: const IDENT,  (trailing comma - missing value)
    var m2 = stripped.match(/^const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*,?\s*$/);
    if (m2 && stripped.indexOf('=') === -1) {
        console.log('FOUND no initializer at line', i+1, ':', line.substring(0, 120));
    }
}

// Also try to narrow down by using binary search approach
// Try loading first half
try {
    var half1 = c.substring(0, Math.floor(c.length / 2));
    new Function(half1 + '\n})}');  // close any open brackets
    console.log('First half: OK');
} catch(e) {
    console.log('First half: ERROR -', e.message);
}

// Check for non-ASCII characters that might confuse Node's parser
for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    // Check if line starts with 'const ' and has weird characters
    if (line.trim().startsWith('const ')) {
        var afterConst = line.trim().substring(6);
        // Look for characters that shouldn't be in const declarations
        if (/[^\x20-\x7E_A-Za-z0-9$]/.test(afterConst.substring(0, 50))) {
            console.log('Weird chars in const at line', i+1, ':', repr(line.substring(0, 100)));
        }
    }
}
