# -*- coding: utf-8 -*-
import re

# Count existing products
with open(r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\products-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Count sku occurrences (each product has a sku: "xxx" line)
skus = re.findall(r'^\s*sku:\s*"([^"]+)"', content, re.MULTILINE)
print(f'Existing products in products-data.js: {len(skus)}')

# Run gen_products.py and count
import importlib.util, sys
spec = importlib.util.spec_from_file_location("gen", r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\gen_products.py')
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
print(f'New products in gen_products.py: {len(mod.new_products)}')
