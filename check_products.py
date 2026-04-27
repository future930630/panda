# -*- coding: utf-8 -*-
import re
from collections import Counter

path = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\products-data.js'
with open(path, encoding='utf-8') as f:
    content = f.read()

skus = re.findall(r'sku:\s+"([^"]+)"', content)
brands = re.findall(r'brand:\s+"([^"]+)"', content)
types = re.findall(r'type:\s+"([^"]+)"', content)

print('SKU count:', len(skus))
print('SKUs:', skus)
print()
print('Brands:', dict(Counter(brands)))
print()
print('Types:', dict(Counter(types)))
