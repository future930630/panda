import re, sys

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
with open(base + '\\products-data.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find all top-level product boundaries
# Pattern: "  {\n" starts an object, "  },\n" ends one
products = []
for i, line in enumerate(lines):
    stripped = line.rstrip('\r\n')
    # Detect top-level object start: line is exactly "  {"
    if stripped == '{' and (i == 0 or lines[i-1].rstrip() == ''):
        # Check if preceded by array bracket or another product
        products.append({'start': i+1, 'type': 'start'})
    # Detect top-level object end: line is exactly "  }," or "  }"
    if stripped == '},':
        products.append({'end': i+1, 'type': 'end'})

# Now pair them
product_starts = [p['start'] for p in products if p['type'] == 'start']
product_ends = [p['end'] for p in products if p['type'] == 'end']

print('Top-level object starts: %d' % len(product_starts))
print('Top-level object ends: %d' % len(product_ends))

if len(product_starts) != len(product_ends):
    print('MISMATCH: starts != ends')
    
# Check for missing commas
errors = []
for idx in range(min(len(product_starts), len(product_ends))):
    end_line = product_ends[idx]
    # The line BEFORE the end should be the last property line
    # The end line should be "  },"
    end_content = lines[end_line - 1].rstrip()
    if end_content != '},':
        errors.append('Line %d: ends with "%s" (expected "  },")' % (end_line, end_content))

print('Errors: %d' % len(errors))
for e in errors[:30]:
    print(e)

# Check around the critical boundaries
print('\n--- Boundary checks ---')
# 20th product (static-dissip) should be at index 19 (0-based)
for check_idx in [18, 19, 20, 21]:  # 19=static-dissip, 20=shield-ANSI-A3
    if check_idx < len(product_ends) and check_idx < len(product_starts):
        end = product_ends[check_idx]
        start = product_starts[check_idx + 1] if check_idx + 1 < len(product_starts) else -1
        print('Product %d: end at line %d ("%s"), next starts at line %d' % (
            check_idx+1, end, lines[end-1].rstrip(),
            start if start > 0 else 'EOF'))
