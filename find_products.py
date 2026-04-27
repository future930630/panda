# -*- coding: utf-8 -*-
import os, re, sys
base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
with open(os.path.join(base, 'products-data.js'), 'r', encoding='utf-8') as f:
    c = f.read()

sku_pat = re.compile(r'sku:\s*"([^"]+)"')
skus = sku_pat.findall(c)
sys.stderr.write('Total skus: %d\n' % len(skus))
sys.stderr.write('First 25 skus:\n')
for i, s in enumerate(skus[:25]):
    sys.stderr.write('  %d: %s\n' % (i+1, s))
sys.stderr.write('...\n')
sys.stderr.write('Last 5 skus:\n')
for i, s in enumerate(skus[-5:]):
    sys.stderr.write('  %d: %s\n' % (len(skus)-4+i, s))
