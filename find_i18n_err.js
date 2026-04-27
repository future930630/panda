var fs = require('fs');
var path = 'i18n.js';
try {
    var c = fs.readFileSync(path, 'utf8');
    // Use acorn or basic parsing to find error
    // Try loading as Node module
    new Function(c);
    console.log('OK');
} catch(e) {
    console.error('ERROR:', e.message);
    // Try to find the line manually
    var lines = c.split('\n');
    // The error 'Missing initializer in const declaration' usually means:
    // const x: value  (colon instead of equals)
    // or: const { ... } without =
    // or: const x  (missing = value)
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var stripped = line.trim();
        // Pattern: const followed by identifier then colon (not in object)
        if (stripped.startsWith('const ')) {
            var rest = stripped.substring(6).trim();
            // If there's a colon and no equals before the colon
            var colonIdx = rest.indexOf(':');
            var eqIdx = rest.indexOf('=');
            if (colonIdx > 0 && (eqIdx === -1 || eqIdx > colonIdx)) {
                console.log('Found suspicious line', i+1, ':', line.substring(0, 100));
            }
            // Also: const IDENT = function or const IDENT = { -- those are OK
            // What about const IDENT:  (colon immediately after identifier)?
            if (colonIdx > 0 && eqIdx === -1) {
                var beforeColon = rest.substring(0, colonIdx).trim();
                // Check if it's just an identifier
                if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(beforeColon)) {
                    console.log('Found const without = at line', i+1, ':', line.substring(0, 120));
                }
            }
        }
    }
}
