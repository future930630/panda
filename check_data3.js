var fs = require('fs');
var path = require('path');
var base = 'c:/Users/Windows13/Desktop/2026.02.23广东-Robin/2026.03.13panda/各版本/20260331999999-2026.04.07-4.0';

// Read products-data.js and find all brand values
var content = fs.readFileSync(path.join(base, 'products-data.js'), 'utf8');

// Find all brand: 'xxx' patterns
var brandRegex = /brand:\s*['"]([^'"]+)['"]/g;
var brands = [];
var match;
while ((match = brandRegex.exec(content)) !== null) {
    brands.push(match[1]);
}
console.log('Total brand entries:', brands.length);
console.log('Unique brands:', [...new Set(brands)].sort());

// Check how many products
var skuRegex = /sku:\s*['"]([^'"]+)['"]/g;
var skus = [];
while ((match = skuRegex.exec(content)) !== null) {
    skus.push(match[1]);
}
console.log('Total products:', skus.length);
console.log('Last 5 SKUs:', skus.slice(-5));
console.log('Last 5 brands:', brands.slice(-5));
