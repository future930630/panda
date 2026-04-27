# -*- coding: utf-8 -*-
import os, re, sys
sys.stdout.reconfigure(encoding='utf-8')

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
pdata = os.path.join(base, 'products-data.js')
g1 = os.path.join(base, '_gen1_output.txt')
g2t = os.path.join(base, '_gen2_trimmed.txt')

with open(pdata, 'r', encoding='utf-8') as f:
    content = f.read()

sku_pat = re.compile(r'"sku":\s*"')
count = len(sku_pat.findall(content))
sys.stderr.write('Product count: %d\n' % count)
sys.stderr.write('File length: %d\n' % len(content))
sys.stderr.write('Last 200 chars: %s\n' % repr(content[-200:]))

# Find all possible array endings
for pat in ['  },\r\n];', '  }\r\n];', '  },\n];', '  }\n];']:
    if pat in content:
        idx = content.index(pat)
        sys.stderr.write('Found "%s" at pos %d\n' % (repr(pat), idx))
        sys.stderr.write('  Context: %s\n' % repr(content[idx-50:idx+len(pat)+10]))
