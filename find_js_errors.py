import re, sys

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
with open(base + '\\products-data.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Check 1: Every top-level object must start with "  {" and end with "  },"
# The array looks like: window.__PANDA_PRODUCTS__ = [\n  {\n    ...\n  },\n  {\n    ...\n  },\n];
errors = []

# Track top-level object boundaries
in_array = False
brace_depth = 0
line_num = 0
obj_start = -1
prev_closing = -1

for i, line in enumerate(lines):
    line_num = i + 1
    stripped = line.rstrip('\r\n')
    
    if '__PANDA_PRODUCTS__' in stripped and '[' in stripped:
        in_array = True
        brace_depth = 0
        continue
    
    if not in_array:
        continue
    
    # Count braces in line
    for ch in stripped:
        if ch == '{':
            brace_depth += 1
        elif ch == '}':
            brace_depth -= 1
    
    # End of top-level object
    if brace_depth == 0 and '{' in stripped:
        # Find the closing brace line
        pass
    
    # Top-level object ends (depth goes from 1 to 0)
    # We need to detect: a line that ends with "}," at depth 0
    # Actually: when brace_depth == 0 and we just closed an object
    if stripped.rstrip().endswith('},') and brace_depth == 0:
        # This is a valid top-level object end
        # Check next non-empty line
        for j in range(i+1, min(i+5, len(lines))):
            next_stripped = lines[j].rstrip('\r\n').strip()
            if not next_stripped:
                continue
            if next_stripped.startswith('{') or next_stripped.startswith('],'):
                # Missing comma check: prev ends with },\n and next starts with {\n
                prev_line = stripped
                if prev_line.rstrip().endswith('},') or prev_line.rstrip().endswith('}'):
                    # The previous line (the last line of the object) must end with },
                    # If it ends with just }, that's fine, but if it ends with }, then next is {,
                    # check if there IS a comma before the }
                    pass
            break

# Check 2: Find every top-level object start/end
products = []
in_product = False
prod_start = -1
prod_lines = []
depth = 0

for i, line in enumerate(lines):
    stripped = line.rstrip('\r\n')
    
    if '__PANDA_PRODUCTS__' in stripped and '[' in stripped:
        depth = 0
        continue
    
    for ch in stripped:
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
    
    if depth == 1 and stripped.strip() == '{':
        prod_start = i + 1
    if depth == 0 and stripped.strip().startswith('}'):
        if prod_start > 0:
            products.append((prod_start, i + 1))

print('Total top-level products found: %d' % len(products))

# Check for missing commas between products
for idx in range(len(products) - 1):
    start1, end1 = products[idx]
    start2, end2 = products[idx + 1]
    last_line_obj1 = lines[end1 - 1].rstrip()
    first_line_obj2 = lines[start2 - 1].rstrip()
    
    # Object 1 must end with }, 
    if not last_line_obj1.rstrip('\r\n').endswith('},'):
        errors.append('Line %d: Product %d ends with "%s" (should end with "  },")' % (
            end1, idx + 1, last_line_obj1.strip()))
    # Object 2 must start with {
    if not first_line_obj2.strip().startswith('{'):
        errors.append('Line %d: Product %d starts with "%s" (should start with "{")' % (
            start2, idx + 2, first_line_obj2.strip()))
    # Check there's no comma at end of object 1 before the }
    # If last line is "  }" without comma -> ERROR
    # If last line is "  }," with comma -> OK

# Also check: if last line ends with "}" not "}," -> ERROR
for idx, (start, end) in enumerate(products):
    last_line = lines[end - 1].rstrip()
    # Remove trailing whitespace and check
    if last_line.strip() == '}':
        errors.append('Line %d: Product %d last line "%s" missing trailing comma!' % (
            end, idx + 1, last_line))
    elif last_line.strip() == '},':
        pass  # OK
    else:
        if last_line.strip().endswith('}'):
            errors.append('Line %d: Product %d last line "%s" - check comma' % (
                end, idx + 1, last_line))

print('Errors found: %d' % len(errors))
for e in errors[:20]:
    print(e)

if len(errors) == 0:
    print('No comma errors found between products!')
