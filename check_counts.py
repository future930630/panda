# -*- coding: utf-8 -*-
import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')
base = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'

fpath = os.path.join(base, '_gen2_output.txt')
with open(fpath, 'rb') as f:
    raw = f.read()
text = raw.decode('utf-16-le', errors='ignore').lstrip('\ufeff').lstrip('\ufffe')

parts = text.split('\r\n\r\n  {')
print(f'Total parts in gen2: {len(parts)}')

# Need 80 - 69 = 11 more products from gen2 (which has 25)
keep_start = 14  # Skip first 14 parts, keep parts[14:] = last 11
trimmed = ('\r\n\r\n  {'.join(parts[keep_start:])).strip()
trimmed_count = len(re.findall(r'"sku":\s*"', trimmed))
print(f'Trimmed gen2: {trimmed_count} products')

fpath1 = os.path.join(base, '_gen1_output.txt')
with open(fpath1, 'rb') as f:
    raw1 = f.read()
text1 = raw1.decode('utf-16-le', errors='ignore').lstrip('\ufeff').lstrip('\ufffe')
gen1_count = len(re.findall(r'"sku":\s*"', text1))
print(f'gen1 has {gen1_count} products')
print(f'Total new: {gen1_count + trimmed_count} (need 80)')

with open(os.path.join(base, '_gen2_trimmed.txt'), 'w', encoding='utf-8') as f:
    f.write(trimmed)
print('Written _gen2_trimmed.txt')
