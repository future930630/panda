import re

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
with open(base + '\\products-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

# Use brace counting to find top-level objects
depth = 0
in_array = False
product_count = 0
errors = []

i = 0
while i < len(lines):
    line = lines[i].rstrip('\r')
    stripped = line.strip()
    
    if '__PANDA_PRODUCTS__' in line and '[' in line:
        in_array = True
        i += 1
        continue
    
    if not in_array:
        i += 1
        continue
    
    # Count braces in this line
    line_depth = 0
    j = 0
    while j < len(line):
        if line[j] == '"' and (j == 0 or line[j-1] != '\\'):
            # Toggle string mode
            j += 1
            in_str = True
            while j < len(line):
                if line[j] == '\\':
                    j += 2
                    continue
                if line[j] == '"':
                    j += 1
                    break
                j += 1
            continue
        if line[j] == '{':
            line_depth += 1
        elif line[j] == '}':
            line_depth -= 1
        j += 1
    
    depth += line_depth
    
    # Top-level object ends when depth goes back to 0
    if depth == 0 and stripped:
        # Check if this is a valid object end
        if stripped == '},':
            product_count += 1
        elif stripped == '};':
            # Last product (no comma)
            product_count += 1
            print('Last product ends at line %d: "%s"' % (i+1, stripped))
        elif stripped == '}':
            errors.append('Line %d: depth=0 but line is "%s" - MISSING COMMA!' % (i+1, stripped))
            product_count += 1  # Count it anyway
        elif stripped == '];':
            print('Array closed at line %d' % (i+1))
        else:
            if stripped not in ['//', '', 'function getProductById']:
                errors.append('Line %d: unexpected "%s" at depth=%d' % (i+1, stripped, depth))
    
    i += 1

print('Products found: %d' % product_count)
print('Errors: %d' % len(errors))
for e in errors:
    print(e)
