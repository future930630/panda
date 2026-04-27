# -*- coding: utf-8 -*-
import re, os

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
with open(os.path.join(base, 'products-data.js'), 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all sku values
skus = re.findall(r'sku:\s+"([^"]+)"\s*,', content)
print(f'Total products (sku count): {len(skus)}')

# Extract all brand values
brands = re.findall(r'brand:\s+"([^"]+)"\s*,', content)
unique_brands = set(brands)
print(f'Unique brand values: {unique_brands}')
print(f'Total brand entries: {len(brands)}')

# Check last 5 products
print(f'Last 5 SKU: {skus[-5:]}')

# Check if all products have brand
missing_brand = len(skus) - len(brands)
print(f'Missing brand field: {missing_brand}')

# Check brand values around gen1->gen2 boundary
print('\nProducts around gen1->gen2 boundary (skus 18-25):')
for i in range(17, min(25, len(skus))):
    b = brands[i] if i < len(brands) else 'MISSING'
    print(f'  {i+1}. {skus[i]} -> brand: {b}')

# Check if any brand has unusual characters
print('\nBrand values with non-ASCII or long:')
for b in unique_brands:
    if not b.isascii():
        print(f'  NON-ASCII: {repr(b)}')
    if len(b) > 20:
        print(f'  LONG: {repr(b)}')

# Count the opening and closing braces of product objects
obj_count = len(re.findall(r'\n\s*\{\s*\n\s*sku:', content))
print(f'\nObjects with sku field: {obj_count}')

# Check for missing commas before new product objects
# Pattern: line ending with } followed by line starting with {
problem_lines = []
lines = content.split('\n')
for i in range(len(lines) - 1):
    curr = lines[i].strip()
    next_l = lines[i+1].strip()
    # If current ends with } (not ,}) and next starts with { 
    if curr == '}' and next_l.startswith('{'):
        problem_lines.append(i+1)
        
print(f'\nPotential missing-comma boundaries: {problem_lines}')
if problem_lines:
    for pl in problem_lines:
        print(f'  Line {pl}: {repr(lines[pl-1][:60])}')
        print(f'  Line {pl+1}: {repr(lines[pl][:60])}')
