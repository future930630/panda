var fs = require('fs');
var path = 'c:/Users/Windows13/Desktop/2026.02.23广东-Robin/2026.03.13panda/各版本/20260331999999-2026.04.07-4.0/products-data.js';
try {
    var c = fs.readFileSync(path, 'utf8');
    eval(c);
    console.log('products-data.js: OK');
    console.log('Product count:', window.__PANDA_PRODUCTS__.length);
    console.log('First SKU:', window.__PANDA_PRODUCTS__[0].sku);
    console.log('Last SKU:', window.__PANDA_PRODUCTS__[99].sku);
    // Check all brands are valid
    var validBrands = ['shield','pierce','impact','chem','bio','volt','heat','frost','grip','eco','nitrile','static','safety','workwear','latex','solvent','antislip'];
    var bad = [];
    for (var i = 0; i < window.__PANDA_PRODUCTS__.length; i++) {
        var p = window.__PANDA_PRODUCTS__[i];
        if (!p.brand) bad.push({i:i, sku:p.sku, err:'no brand'});
        else if (validBrands.indexOf(p.brand) === -1) bad.push({i:i, sku:p.sku, err:'invalid brand: '+p.brand});
    }
    if (bad.length) console.log('BAD PRODUCTS:', JSON.stringify(bad));
    else console.log('All products have valid brands');
} catch(e) {
    console.error('ERROR:', e.message);
}
