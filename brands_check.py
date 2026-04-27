# -*- coding: utf-8 -*-
import os, re, sys
base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
with open(os.path.join(base, 'products-data.js'), 'r', encoding='utf-8') as f:
    c = f.read()

brands = set(re.findall(r'brand:\s*"([^"]+)"', c))
sys.stderr.write('All brands found: %s\n' % sorted(brands))
sys.stderr.write('Total unique brands: %d\n' % len(brands))

# Count per brand
from collections import Counter
brand_counts = Counter(re.findall(r'brand:\s*"([^"]+)"', c))
sys.stderr.write('Per brand:\n')
for b, cnt in sorted(brand_counts.items()):
    sys.stderr.write('  %s: %d\n' % (b, cnt))
