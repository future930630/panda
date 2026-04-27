# -*- coding: utf-8 -*-
import os, sys
sys.stdout.reconfigure(encoding='utf-8')

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
pdata = os.path.join(base, 'products-data.js')
g1 = os.path.join(base, '_gen1_output.txt')
g2t = os.path.join(base, '_gen2_trimmed.txt')

print('Step 0: Check files exist')
print('  pdata:', os.path.exists(pdata))
print('  g1:', os.path.exists(g1))
print('  g2t:', os.path.exists(g2t))

print('Step 1: Read products-data.js')
try:
    with open(pdata, 'r', encoding='utf-8') as f:
        content = f.read()
    print('  Read %d chars' % len(content))
except Exception as e:
    print('  ERROR: %s' % e)
    sys.exit(1)

print('Step 2: Check array close')
arr_close = '  },\r\n];'
print('  arr_close found:', arr_close in content)
print('  Last 50 chars: %s' % repr(content[-60:]))
if arr_close not in content:
    print('ERROR: array close not found!')
    sys.exit(1)

print('Step 3: Read gen1 (UTF-16-LE)')
try:
    with open(g1, 'rb') as f:
        raw1 = f.read()
    gen1 = raw1.decode('utf-16-le', errors='ignore').lstrip('\ufeff').lstrip('\ufffe').strip()
    print('  gen1: %d chars' % len(gen1))
except Exception as e:
    print('  ERROR: %s' % e)
    sys.exit(1)

print('Step 4: Read gen2_trimmed (UTF-8)')
try:
    with open(g2t, 'r', encoding='utf-8') as f:
        gen2 = f.read().strip()
    print('  gen2: %d chars' % len(gen2))
except Exception as e:
    print('  ERROR: %s' % e)
    sys.exit(1)

print('Step 5: Count products')
import re
sku_pat = re.compile(r'"sku":\s*"')
orig_count = len(sku_pat.findall(content))
gen1_count = len(sku_pat.findall(gen1))
gen2_count = len(sku_pat.findall(gen2))
total = orig_count + gen1_count + gen2_count
print('  orig=%d gen1=%d gen2=%d total=%d' % (orig_count, gen1_count, gen2_count, total))

print('Step 6: Build and write')
new_products = gen1 + '\r\n\r\n' + gen2
new_content = content.replace(arr_close, '  },\r\n' + new_products + '\r\n];')
print('  New content: %d chars' % len(new_content))

try:
    with open(pdata, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('  Written OK')
except Exception as e:
    print('  ERROR writing: %s' % e)
    sys.exit(1)

print('Step 7: Verify')
with open(pdata, 'r', encoding='utf-8') as f:
    verify = f.read()
final_count = len(sku_pat.findall(verify))
print('  Final count: %d products' % final_count)
print('ALL DONE')
