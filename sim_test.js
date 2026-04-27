// 模拟浏览器执行顺序
var fs = require('fs');
var path = require('path');
var base = 'c:/Users/Windows13/Desktop/2026.02.23广东-Robin/2026.03.13panda/各版本/20260331999999-2026.04.07-4.0';

// 1. 执行 products-data.js（定义 window.__PANDA_PRODUCTS__）
var window = global;
try {
    eval(fs.readFileSync(path.join(base, 'products-data.js'), 'utf8'));
    console.log('products-data.js: OK, products count:', window.__PANDA_PRODUCTS__.length);
    console.log('Last product:', window.__PANDA_PRODUCTS__[99].sku, 'brand:', window.__PANDA_PRODUCTS__[99].brand);
} catch(e) {
    console.error('products-data.js ERROR:', e.message);
    process.exit(1);
}

// 2. 执行 products-all.js（定义所有函数 + 初始化）
try {
    var paCode = fs.readFileSync(path.join(base, 'products-all.js'), 'utf8');
    eval(paCode);
    console.log('products-all.js: OK (functions defined)');
} catch(e) {
    console.error('products-data.js AFTER pa-all.js ERROR:', e.message);
    process.exit(1);
}
