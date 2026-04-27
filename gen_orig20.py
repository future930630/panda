# -*- coding: utf-8 -*-
"""从 _gen1_output.txt 提取原始 20 个产品的 sku，然后重新构建 products-data.js"""
import os, re, sys
sys.stdout.reconfigure(encoding='utf-8')

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
PDATA = os.path.join(base, 'products-data.js')
G1 = os.path.join(base, '_gen1_output.txt')
G2T = os.path.join(base, '_gen2_trimmed.txt')

# ------------------------------------------------------------------
# 原始 20 个产品的 sku 列表（从 session summary 确认）
# ------------------------------------------------------------------
ORIG_20_SKUS = [
    "shield-cut5", "shield-cut3", "shield-max-cut",
    "pierce-grade5", "pierce-grip",
    "impact-anti", "impact-punch",
    "chem-anti", "chem-resistant",
    "bio-safe", "bio-exam",
    "volt-insulate", "volt-7000",
    "heat-fire", "heat-weld",
    "frost-winter", "frost-grip",
    "eco-recycled", "eco-biodegradable",
    "grip-anti-slip"
]

# ------------------------------------------------------------------
# Step 1: 从 gen1 提取原始 20 个产品的原始文本
# ------------------------------------------------------------------
with open(G1, 'rb') as f:
    raw1 = f.read()
gen1_raw = raw1.decode('utf-16-le', errors='ignore').lstrip('\ufeff').lstrip('\ufffe')

# 去掉 "Generated 69 new products\r\n" 头部
if gen1_raw.startswith('Generated'):
    gen1_raw = gen1_raw[gen1_raw.index('\n')+1:].lstrip()

# 解析 gen1_raw 中每个产品的 sku
# gen1_raw 中的产品格式: "sku": "xxx", (quoted keys, \r\n endings)
# 分割：每个产品以 "\r\n  }," 结尾
import json

# 用 \r\n  { 来分割各个产品对象
# 但这不太好用 JSON 解析，因为键没有引号
# 改用 sku 模式来计数

# 实际上：gen1_raw 中的 sku 是 "sku": "xxx",
# 原始文件中的 sku 是 sku: "xxx",
# 所以只要提取 sku 值，就能找到对应产品的文本

sku_pat = re.compile(r'"sku":\s*"([^"]+)"')
all_skus_in_gen1 = sku_pat.findall(gen1_raw)
sys.stderr.write('gen1 total skus: %d\n' % len(all_skus_in_gen1))

# 找出前 20 个 sku（原始产品）和后 69-20=49 个（gen1 新产品）
orig_20_in_gen1 = []
new_49_in_gen1 = []
orig_set = set(ORIG_20_SKUS)

for sku in all_skus_in_gen1:
    if sku in orig_set and sku not in orig_20_in_gen1:
        orig_20_in_gen1.append(sku)
    else:
        new_49_in_gen1.append(sku)

sys.stderr.write('Found orig in gen1: %d\n' % len(orig_20_in_gen1))
sys.stderr.write('New from gen1: %d\n' % len(new_49_in_gen1))

# ------------------------------------------------------------------
# Step 2: 构建原始 20 个产品数据（从 gen1 中提取）
# ------------------------------------------------------------------
def extract_product_text(full_text, sku):
    """从完整文本中提取指定 sku 的产品对象文本"""
    # 找到 sku 位置
    sku_str = '"sku": "' + sku + '"'
    idx = full_text.find(sku_str)
    if idx < 0:
        return None
    # 向前找到 "  {"
    start = full_text.rfind('  {', 0, idx)
    if start < 0:
        start = full_text.rfind('{', 0, idx)
    # 向后找到 "  }," 结尾
    end = full_text.find('  },', idx)
    if end < 0:
        end = full_text.find('},', idx)
    if end < 0:
        return None
    end += 3  # 包含 }, 
    return full_text[start:end]

# 从 gen1_raw 提取原始 20 个产品
orig_products_texts = []
for sku in ORIG_20_SKUS:
    text = extract_product_text(gen1_raw, sku)
    if text:
        orig_products_texts.append(text)
        sys.stderr.write('  Extracted %s: %d chars\n' % (sku, len(text)))
    else:
        sys.stderr.write('  MISSING: %s\n' % sku)

# ------------------------------------------------------------------
# Step 3: unquote_keys（将 quoted keys 转为 unquoted）
# ------------------------------------------------------------------
def unquote_keys(text):
    return re.sub(r'"([a-zA-Z_][a-zA-Z0-9_]*)"\s*:', r'\1:', text)

orig_20_unquoted = [unquote_keys(t) for t in orig_products_texts]
sys.stderr.write('Step 3: Unquoted %d original products\n' % len(orig_20_unquoted))

# ------------------------------------------------------------------
# Step 4: 处理 gen1 中的新产品（去掉原始 20 个）
# ------------------------------------------------------------------
gen1_new_texts = []
for sku in new_49_in_gen1:
    text = extract_product_text(gen1_raw, sku)
    if text:
        gen1_new_texts.append(unquote_keys(text))

sys.stderr.write('Step 4: gen1 new products: %d\n' % len(gen1_new_texts))

# ------------------------------------------------------------------
# Step 5: 读取并处理 gen2_trimmed（11 个新产品）
# ------------------------------------------------------------------
with open(G2T, 'r', encoding='utf-8') as f:
    gen2_raw = f.read().strip()

gen2_skus = sku_pat.findall(gen2_raw)
sys.stderr.write('gen2 skus: %d -> %s\n' % (len(gen2_skus), gen2_skus))

gen2_new_texts = []
for sku in gen2_skus:
    text = extract_product_text(gen2_raw, sku)
    if text:
        gen2_new_texts.append(unquote_keys(text))

sys.stderr.write('Step 5: gen2 products: %d\n' % len(gen2_new_texts))

# ------------------------------------------------------------------
# Step 6: 读取原始文件头部（注释等）
# ------------------------------------------------------------------
with open(PDATA, 'r', encoding='utf-8') as f:
    current = f.read()

# 从当前文件中提取头部注释
header_end = current.find('window.__PANDA_PRODUCTS__ = [')
if header_end < 0:
    sys.stderr.write('ERROR: cannot find __PANDA_PRODUCTS__\n')
    sys.exit(1)

# 找函数定义（helper functions）
funcs_start = current.rfind('// --- Helper')
if funcs_start < 0:
    funcs_start = current.rfind('function getProductById')
if funcs_start < 0:
    funcs_start = current.find('function getProductById')
    
sys.stderr.write('Header ends at: %d, Functions start at: %d\n' % (header_end, funcs_start))

header = current[:funcs_start]
funcs = current[funcs_start:]
sys.stderr.write('Header: %d chars, funcs: %d chars\n' % (len(header), len(funcs)))

# ------------------------------------------------------------------
# Step 7: 组装新产品数组
# ------------------------------------------------------------------
all_new_products = orig_20_unquoted + gen1_new_texts + gen2_new_texts
sys.stderr.write('Total new products: %d\n' % len(all_new_products))

new_array = 'window.__PANDA_PRODUCTS__ = [\n'
for i, p in enumerate(all_new_products):
    # p 已经是单行格式 "sku: ..., ...,\n  },\n"
    # 去掉前后空白，加换行
    pt = p.strip()
    if not pt.endswith(','):
        pt = pt + ','
    new_array += '  ' + pt + '\n'
new_array = new_array.rstrip().rstrip(',') + '\n'
new_array += '];\n'

new_content = header + new_array + funcs
sys.stderr.write('New content: %d chars\n' % len(new_content))

# ------------------------------------------------------------------
# Step 8: 写回文件
# ------------------------------------------------------------------
with open(PDATA, 'w', encoding='utf-8') as f:
    f.write(new_content)
sys.stderr.write('Written OK\n')

# ------------------------------------------------------------------
# Step 9: 验证
# ------------------------------------------------------------------
with open(PDATA, 'r', encoding='utf-8') as f:
    verify = f.read()
sku_pat2 = re.compile(r'sku:\s*"')
final_count = len(sku_pat2.findall(verify))
sys.stderr.write('Final count: %d products\n' % final_count)
if final_count == 100:
    sys.stderr.write('[OK] SUCCESS: 100 products!\n')
else:
    sys.stderr.write('[!] ERROR: expected 100, got %d\n' % final_count)
