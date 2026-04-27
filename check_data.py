import re, os

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
with open(os.path.join(base, 'products-data.js'), 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all sku values
skus = re.findall(r'sku:\s*"([^"]+)"\s*,', content)
print(f'Total products (sku count): {len(skus)}')

# Extract all brand values
brands = re.findall(r'brand:\s*"([^"]+)"\s*,', content)
unique_brands = set(brands)
print(f'Unique brand values: {unique_brands}')
print(f'Total brand entries: {len(brands)}')

# Check last 5 products
print(f'\nLast 5 SKU: {skus[-5:]}')

# Check if all products have brand
missing_brand = len(skus) - len(brands)
print(f'\nMissing brand field: {missing_brand}')

# Check brand values near gen2 boundary
print('\nProducts around gen1->gen2 boundary (skus 18-25):')
for i, s in enumerate(skus[17:25]):
    print(f'  {i+19}. {s} -> brand: {brands[i+17] if i+17 < len(brands) else "MISSING"}')

# Check if any brand has unusual characters or unicode
print('\nBrand values with non-ASCII:')
for b in unique_brands:
    if not b.isascii():
        print(f'  NON-ASCII: {repr(b)}')
    if len(b) > 20:
        print(f'  LONG: {repr(b)}')

# Try to parse the JS as JSON-like (without functions)
print('\n--- Checking data integrity ---')
# Remove all function bodies for parsing attempt
clean = re.sub(r',\s*\w+\s*:\s*function\([^)]*\)\s*\{[^}]*\}', '', content)
clean = re.sub(r'\([^)]*\)\s*=>\s*\{[^}]*\}', '', clean)
# Try to find all product objects
# Count the opening and closing braces of product objects
# Simplified: just count objects with sku field
obj_count = len(re.findall(r'\n\s*\{\s*\n\s*sku:', content))
print(f'Objects with sku field: {obj_count}')
