import os, re, sys

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
pdata = os.path.join(base, 'products-data.js')

with open(pdata, 'r', encoding='utf-8') as f:
    content = f.read()

# Check around the fix
idx = content.find('shield-ANSI-A3')
sys.stderr.write('Before shield-ANSI-A3: %s\n' % repr(content[idx-50:idx+30]))

# Count products
sku_pat = re.compile(r'sku:\s*"')
count = len(sku_pat.findall(content))
sys.stderr.write('SKU count: %d\n' % count)

# Check the boundary between orig 20 and gen1
idx2 = content.find('faq: [],')
next_obj = content.find('\n{\n    sku:', idx2)
sys.stderr.write('After faq - next object: %s\n' % repr(content[next_obj:next_obj+60]))

# Extract and validate array
arr_start = content.find('window.__PANDA_PRODUCTS__ = [')
arr_end = content.find('];', arr_start) + 2
sys.stderr.write('Array section: %d chars\n' % (arr_end - arr_start))

# Find products by counting {
p = content[arr_start:arr_end]
brace_count = 0
product_count = 0
in_string = False
escape_next = False
for ch in p:
    if escape_next:
        escape_next = False
        continue
    if ch == '\\':
        escape_next = True
        continue
    if ch == '"' and not escape_next:
        in_string = not in_string
        continue
    if in_string:
        continue
    if ch == '{':
        brace_count += 1
    elif ch == '}':
        brace_count -= 1
        if brace_count == 0:
            product_count += 1

sys.stderr.write('Product count from brace tracking: %d\n' % product_count)
sys.stderr.write('File ends: %s\n' % repr(content[-100:]))
sys.stderr.write('DONE\n')
