# -*- coding: utf-8 -*-
import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')
base = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
fpath = os.path.join(base, 'products-data.js')
with open(fpath, 'rb') as f:
    raw = f.read()
text = raw.decode('utf-8-sig', errors='ignore')

# Find all '  },' occurrences (end of each product object)
matches = [m.start() for m in re.finditer(r'  \},', text)]
print(f'Found {len(matches)} product endings')
for i in matches[-3:]:
    print(f'  Position {i}: {repr(text[i:i+60])}')

# The array closes after the last '  },' with a '];'
# Find '];' after the last '  },'
last_prod_end = max(matches)
semi_idx = text.find('];', last_prod_end)
print(f'Array ends at position {semi_idx} (after last product)')
print(f'Content around array end:')
print(repr(text[semi_idx-50:semi_idx+5]))
