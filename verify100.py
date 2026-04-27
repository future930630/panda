# -*- coding: utf-8 -*-
import os, re, sys
base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
with open(os.path.join(base, 'products-data.js'), 'r', encoding='utf-8') as f:
    c = f.read()
sys.stderr.write('Total chars: %d\n' % len(c))
sys.stderr.write('Ends with: %s\n' % repr(c[-30:]))
sys.stderr.write('Starts with: %s\n' % repr(c[:50]))
sku_pat = re.compile(r'sku:\s*"')
sys.stderr.write('SKU count: %d\n' % len(sku_pat.findall(c)))
# Check first new product around shield-ANSI-A3
idx = c.find('shield-ANSI-A3')
if idx > 0:
    sys.stderr.write('Around shield-ANSI-A3: %s\n' % repr(c[idx-30:idx+60]))
# Check it has unquoted keys (not "sku")
sys.stderr.write('Has quoted sku in new area: %s\n' % ('"sku":' in c[idx-10:idx+10]))
# Check the transition: last original -> first new
idx2 = c.rfind('PandaSHIELD Cut Resistant Glove Level 5')
if idx2 > 0:
    sys.stderr.write('Context around last original: %s\n' % repr(c[idx2-10:idx2+100]))
