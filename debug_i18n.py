# -*- coding: utf-8 -*-
import os, sys

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
path = os.path.join(base, 'i18n.js')

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Binary search approach: try halves to narrow down
# First, let's try to parse it
import re

lines = content.split('\n')

# Look for: "const" followed by space then ALLCAPS identifier then ":" (without "=")
# This is the "Missing initializer in const declaration" error pattern
problems = []
for i, line in enumerate(lines):
    s = line.strip()
    if not s.startswith('const '):
        continue
    rest = s[6:].strip()  # after "const "
    # Skip "const I18N ="
    if rest.startswith('I18N'):
        continue
    # Check: const IDENT: or const IDENT: {
    m = re.match(r'^([A-Z][A-Z0-9_]*)\s*:\s*', rest)
    if m:
        problems.append((i+1, repr(line[:100])))
    # Also: const IDENT followed by colon directly
    m2 = re.match(r'^([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*(.)', rest)
    if m2:
        problems.append((i+1, repr(line[:100]), 'direct colon'))

print(f'Found {len(problems)} potential const issues')
for p in problems[:20]:
    print(f'  Line {p[0]}: {p[1]}')
    if len(p) > 2:
        print(f'  Type: {p[2]}')

# Also check: const IDENT = function or const IDENT = {  -- these are OK
# Check for const without =
for i, line in enumerate(lines):
    s = line.strip()
    if s.startswith('const ') and ':' in s:
        # Get the part before the first colon
        before_colon = s.split(':')[0]
        # If there's no = in the before_colon, it's suspicious
        if '=' not in before_colon and before_colon.strip() != 'const ':
            # Make sure it's not the object property pattern (zh: {, en: {)
            # Those have single-letter keys
            key_part = before_colon[6:].strip()  # after "const "
            if len(key_part) > 2:
                print(f'SUSPICIOUS const at line {i+1}: {repr(line[:100])}')
