# -*- coding: utf-8 -*-
import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')
base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
sku_pat = re.compile(r'"sku":\s*"')

PDATA = os.path.join(base, 'products-data.js')
G1 = os.path.join(base, '_gen1_output.txt')
G2T = os.path.join(base, '_gen2_trimmed.txt')

print('Step 1: Read products-data.js')
with open(PDATA, 'r', encoding='utf-8') as f:
    orig = f.read()
print('  Read %d chars' % len(orig))

print('Step 2: Check array closing')
arr_close = '  },\r\n];'
if arr_close not in orig:
    print('ERROR: not found')
    sys.exit(1)
print('  Found array close')

print('Step 3: Read gen1')
with open(G1, 'rb') as f:
    raw1 = f.read()
gen1 = raw1.decode('utf-16-le', errors='ignore').lstrip('\ufeff').lstrip('\ufffe').strip()
print('  gen1: %d chars' % len(gen1))

print('Step 4: Read gen2_trimmed')
with open(G2T, 'r', encoding='utf-8') as f:
    gen2 = f.read().strip()
print('  gen2: %d chars' % len(gen2))

print('Step 5: Count products')
orig_count = len(sku_pat.findall(orig))
gen1_count = len(sku_pat.findall(gen1))
gen2_count = len(sku_pat.findall(gen2))
print('  orig=%d gen1=%d gen2=%d total=%d' % (orig_count, gen1_count, gen2_count, orig_count+gen1_count+gen2_count))

print('Step 6: Build new content')
new_products = gen1 + '\r\n\r\n' + gen2
new = orig.replace(arr_close, '  },\r\n' + new_products + '\r\n];')
print('  New content: %d chars' % len(new))

print('Step 7: Write products-data.js')
try:
    with open(PDATA, 'w', encoding='utf-8') as f:
        f.write(new)
    print('  Written successfully')
except Exception as e:
    print('  ERROR writing: %s' % e)
    sys.exit(1)

print('Step 8: Verify')
with open(PDATA, 'r', encoding='utf-8') as f:
    verify = f.read()
final_count = len(sku_pat.findall(verify))
print('  Final count: %d products' % final_count)
print('ALL DONE')
