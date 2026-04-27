# -*- coding: utf-8 -*-
import os, re, sys
base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
with open(os.path.join(base, 'products-data.js'), 'r', encoding='utf-8') as f:
    c = f.read()

# 1. 文件大小
sys.stderr.write('File size: %d chars\n' % len(c))

# 2. 检查有没有残留的 header 文字
for kw in ['Generated 69', 'Generated 25', 'new products', 'unicode escape']:
    if kw in c:
        idx = c.index(kw)
        sys.stderr.write('FOUND "%s" at %d: %s\n' % (kw, idx, repr(c[idx-20:idx+40])))

# 3. 检查末尾
sys.stderr.write('Last 100 chars: %s\n' % repr(c[-100:]))

# 4. 检查有无语义错误关键词（中文编码失败产生的乱码）
bad_patterns = ['\\u', '????', '\ufffd']
for pat in bad_patterns:
    count = c.count(pat)
    sys.stderr.write('"%s" appears %d times\n' % (repr(pat), count))

# 5. 检查函数定义完整
for fn in ['function getProductById', 'function getBundleProducts', 'function getProductName']:
    if fn in c:
        sys.stderr.write('OK: %s found\n' % fn)
    else:
        sys.stderr.write('MISSING: %s\n' % fn)

# 6. 抽样：第1个、第30个、第90个、第100个产品的格式
sku_pat = re.compile(r'sku:\s*"([^"]+)"')
all_skus = sku_pat.findall(c)
sys.stderr.write('\nTotal skus: %d\n' % len(all_skus))
sys.stderr.write('Sample positions:\n')
for pos in [0, 20, 69, 99]:
    if pos < len(all_skus):
        sku = all_skus[pos]
        idx = c.find('sku: "' + sku + '"')
        # 检查前后20个字符
        context = c[idx-15:idx+35]
        has_quoted = '"sku":' in context
        sys.stderr.write('  [%d] %s -> context: %s (quoted=%s)\n' % (pos, sku, repr(context[:40]), has_quoted))
