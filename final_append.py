# -*- coding: utf-8 -*-
"""重建 products-data.js: 原始20个产品 + 80个新产品（gen1 69 + gen2 11）"""
import os, re, sys
sys.stdout.reconfigure(encoding='utf-8')

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
PDATA = os.path.join(base, 'products-data.js')
G1 = os.path.join(base, '_gen1_output.txt')
G2T = os.path.join(base, '_gen2_trimmed.txt')

# ------------------------------------------------------------------
# 原始 20 个 SKU（已确认）
# ------------------------------------------------------------------
ORIG_SKUS = [
    "shield-cut5","shield-tear4","shield-wear","pierce-proof","impact-resist",
    "chem-resist","bio-protect","volt-insulate","heat-nomex","frost-protect",
    "grip-vibro","eco-recycled","nitrile-oil","latex-heat","shield-sleeve",
    "safety-goggles","workwear-set","antislip-grip","solvent-resist","static-dissip"
]

# ------------------------------------------------------------------
# Step 1: 从当前文件读取原始 20 个产品
# ------------------------------------------------------------------
with open(PDATA, 'r', encoding='utf-8') as f:
    content = f.read()

# 找到 __PANDA_PRODUCTS__ 数组开始
arr_start = content.find('window.__PANDA_PRODUCTS__ = [')
if arr_start < 0:
    sys.stderr.write('[!] ERROR: __PANDA_PRODUCTS__ not found\n')
    sys.exit(1)

# 提取头部（注释）
header = content[:arr_start]
sys.stderr.write('[1] Header: %d chars\n' % len(header))

# 提取函数定义（从第一个 function 开始）
funcs_start = content.find('function getProductById')
if funcs_start < 0:
    funcs_start = content.find('function getBundleProducts')
if funcs_start < 0:
    funcs_start = len(content)
sys.stderr.write('[1] Functions start at: %d\n' % funcs_start)

# 提取 products 数组内容
products_section = content[arr_start:funcs_start]

# 找到第 20 个产品的结束位置
# 每个产品以 "  }," 结尾（Unix newline）
prod_end_pat = re.compile(r'  },\n')
ends = [(m.start(), m.group()) for m in prod_end_pat.finditer(products_section)]
sys.stderr.write('[1] Product end markers: %d\n' % len(ends))

if len(ends) < 20:
    sys.stderr.write('[!] ERROR: only %d product ends found\n' % len(ends))
    sys.exit(1)

# 第 20 个产品结束位置（在 products_section 中）
# products_section 从 arr_start 开始，所以要加回 arr_start
prod20_end_in_content = arr_start + ends[19][0] + 3  # +3 for "  },"
orig_products_text = content[arr_start:prod20_end_in_content]
sys.stderr.write('[1] Original 20 products: %d chars\n' % len(orig_products_text))

# 验证：前20个 sku
orig_skus_found = re.findall(r'sku:\s*"([^"]+)"', orig_products_text)
sys.stderr.write('[1] Found %d skus in original section\n' % len(orig_skus_found))

# ------------------------------------------------------------------
# Step 2: 读取并处理 gen1（去掉 header，unquote keys）
# ------------------------------------------------------------------
with open(G1, 'rb') as f:
    raw1 = f.read()
gen1_raw = raw1.decode('utf-16-le', errors='ignore').lstrip('\ufeff').lstrip('\ufffe')
# 去掉 "Generated 69 new products\r\n" 头部
if gen1_raw.startswith('Generated'):
    gen1_raw = gen1_raw[gen1_raw.index('\n')+1:].lstrip()

def unquote_keys(text):
    return re.sub(r'"([a-zA-Z_][a-zA-Z0-9_]*)"\s*:', r'\1:', text)

gen1_unquoted = unquote_keys(gen1_raw)
gen1_skus = re.findall(r'sku:\s*"([^"]+)"', gen1_unquoted)
sys.stderr.write('[2] gen1 products: %d (skus: %s)\n' % (len(gen1_skus), gen1_skus[:3]))

# ------------------------------------------------------------------
# Step 3: 读取并处理 gen2_trimmed（unquote keys）
# ------------------------------------------------------------------
with open(G2T, 'r', encoding='utf-8') as f:
    gen2_raw = f.read().strip()
gen2_unquoted = unquote_keys(gen2_raw)
gen2_skus = re.findall(r'sku:\s*"([^"]+)"', gen2_unquoted)
sys.stderr.write('[3] gen2 products: %d (skus: %s)\n' % (len(gen2_skus), gen2_skus[:3]))

# ------------------------------------------------------------------
# Step 4: 统计
# ------------------------------------------------------------------
total = len(orig_skus_found) + len(gen1_skus) + len(gen2_skus)
sys.stderr.write('[4] orig=%d gen1=%d gen2=%d total=%d\n' % (
    len(orig_skus_found), len(gen1_skus), len(gen2_skus), total))

# ------------------------------------------------------------------
# Step 5: 组装新文件内容
# ------------------------------------------------------------------
# gen1 末尾是 "  }," (Unix newline)
# gen2 格式是 "  {" 开始，"  }," 结束
# 用 \n\n 连接

# 修复 gen1 末尾格式（gen1 原始末尾可能是 "  },\n"）
gen1_end = gen1_unquoted.rstrip()
if not gen1_end.endswith('},'):
    gen1_end += ','

# gen2 已经是正常格式（以 "  {" 开始）
gen2_text = gen2_unquoted.strip()
if not gen2_text.endswith(','):
    gen2_text += ','

# 组装新产品
new_products = '\n' + gen1_end + '\n\n' + gen2_text + '\n'

# 构建完整数组
new_arr = orig_products_text.rstrip() + new_products + '];\n'
sys.stderr.write('[5] New array: %d chars\n' % len(new_arr))

new_content = header + new_arr + content[funcs_start:]
sys.stderr.write('[5] Total new content: %d chars\n' % len(new_content))

# ------------------------------------------------------------------
# Step 6: 写回文件
# ------------------------------------------------------------------
with open(PDATA, 'w', encoding='utf-8') as f:
    f.write(new_content)
sys.stderr.write('[6] Written OK\n')

# ------------------------------------------------------------------
# Step 7: 验证
# ------------------------------------------------------------------
with open(PDATA, 'r', encoding='utf-8') as f:
    verify = f.read()
sku_pat = re.compile(r'sku:\s*"([^"]+)"')
final_skus = sku_pat.findall(verify)
sys.stderr.write('[7] Final count: %d products\n' % len(final_skus))
sys.stderr.write('[7] Last 5 skus: %s\n' % final_skus[-5:])
sys.stderr.write('[7] First 5 skus: %s\n' % final_skus[:5])

if len(final_skus) == 100:
    sys.stderr.write('[OK] SUCCESS!\n')
else:
    sys.stderr.write('[!] WARNING: expected 100, got %d\n' % len(final_skus))
    # 检查是否有重复
    from collections import Counter
    dupes = [s for s, c in Counter(final_skus).items() if c > 1]
    if dupes:
        sys.stderr.write('[!] Duplicates: %s\n' % dupes[:10])
