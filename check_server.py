import re, sys, urllib.request

url = 'http://localhost:3000/products-data.js'
req = urllib.request.urlopen(url)
data = req.read()
txt = data.decode('utf-8-sig')  # Remove BOM
print('Total chars: %d' % len(txt))
print('First 80: %s' % repr(txt[:80]))
print('Last 50: %s' % repr(txt[-50:]))

# Count skus
count = len(re.findall(r'sku:\s*"', txt))
print('SKU count: %d' % count)

# Check first 5 products
sku_positions = [m.start() for m in re.finditer(r'sku:\s*"', txt)]
print('First 5 skus:')
for pos in sku_positions[:5]:
    end = txt.find('",', pos)
    sku = txt[pos:end+2]
    print('  %s' % sku[:50])

# Check around the 20th product boundary
if len(sku_positions) > 20:
    pos = sku_positions[19]  # 20th product (0-indexed)
    print('\n20th product at pos %d: %s' % (pos, repr(txt[pos-20:pos+40])))
    print('21st product at pos %d: %s' % (sku_positions[20], repr(txt[sku_positions[20]-20:sku_positions[20]+40])))
