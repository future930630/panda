# -*- coding: utf-8 -*-
import re, os

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
with open(os.path.join(base, 'products-data.js'), 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

# Find all lines that are ONLY "  }," or "  }" (end of product)
# then check if the NEXT non-empty line starts with "sku:" instead of "  {"
# This indicates a missing opening brace

problems = []
i = 0
while i < len(lines):
    stripped = lines[i].rstrip()
    # Check if this line ends a product object
    if stripped == '},' or stripped == '}':
        # Look at next non-empty line
        j = i + 1
        while j < len(lines) and lines[j].strip() == '':
            j += 1
        if j < len(lines):
            next_stripped = lines[j].strip()
            # Next non-empty line should start with "  {" for new product
            # OR it's "]" for array end
            if next_stripped == '];':
                # Valid array end
                pass
            elif next_stripped.startswith('sku:'):
                # PROBLEM: missing opening brace
                problems.append({
                    'line_close': i + 1,
                    'line_sku': j + 1,
                    'sku': re.search(r'sku:\s*"([^"]+)"', next_stripped).group(1) if re.search(r'sku:\s*"([^"]+)"', next_stripped) else '?',
                    'context_close': lines[i],
                    'context_sku': lines[j]
                })
            elif next_stripped == '{':
                # OK - properly has opening brace
                pass
            elif next_stripped.startswith('{'):
                # Also OK
                pass
            else:
                # Unexpected pattern
                problems.append({
                    'line_close': i + 1,
                    'line_sku': j + 1,
                    'sku': 'UNKNOWN',
                    'context_close': lines[i],
                    'context_sku': lines[j],
                    'note': 'unexpected pattern'
                })
    i += 1

print(f'Total problems found: {len(problems)}')
for p in problems:
    print(f'\nLine {p["line_close"]}: {repr(p["context_close"])}')
    print(f'Line {p["line_sku"]}: {repr(p["context_sku"][:60])}')
    if 'sku' in p and p['sku'] != '?':
        print(f'  Affected SKU: {p["sku"]}')
    if 'note' in p:
        print(f'  NOTE: {p["note"]}')
