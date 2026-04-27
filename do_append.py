# -*- coding: utf-8 -*-
"""将 80 个新产品追加到 products-data.js，同时将 quoted keys 转为 unquoted keys"""
import os, re, sys
sys.stdout.reconfigure(encoding='utf-8')

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
PDATA = os.path.join(base, 'products-data.js')
G1 = os.path.join(base, '_gen1_output.txt')
G2T = os.path.join(base, '_gen2_trimmed.txt')

# ------------------------------------------------------------------
# Step 1: Read products-data.js
# ------------------------------------------------------------------
with open(PDATA, 'r', encoding='utf-8') as f:
    orig = f.read()
sys.stderr.write('[1] Read pdata: %d chars\n' % len(orig))

# 确认 array close（Unix 换行）
arr_close = '  },\n];'
idx = orig.rfind(arr_close)
if idx < 0:
    sys.stderr.write('[!] ERROR: array close not found\n')
    sys.exit(1)
sys.stderr.write('[1] Array close at pos %d\n' % idx)

# ------------------------------------------------------------------
# Step 2: Read gen1 (UTF-16-LE with BOM)
# ------------------------------------------------------------------
with open(G1, 'rb') as f:
    raw1 = f.read()
gen1_raw = raw1.decode('utf-16-le', errors='ignore').lstrip('\ufeff').lstrip('\ufffe')
# 去掉 "Generated 69 new products\n" 头部
if gen1_raw.startswith('Generated'):
    gen1_raw = gen1_raw[gen1_raw.index('\n')+1:].lstrip()
sys.stderr.write('[2] gen1 (raw): %d chars\n' % len(gen1_raw))

# ------------------------------------------------------------------
# Step 3: Read gen2_trimmed (UTF-8)
# ------------------------------------------------------------------
with open(G2T, 'r', encoding='utf-8') as f:
    gen2_raw = f.read().strip()
sys.stderr.write('[3] gen2: %d chars\n' % len(gen2_raw))

# ------------------------------------------------------------------
# Step 4: 将 quoted keys 转为 unquoted
#    "key": value  ->  key: value
#    匹配 "key": (key不含空格)，排除 value 中的引号
# ------------------------------------------------------------------
def unquote_keys(text):
    """将 "key": 模式的引号去掉（仅处理 key，value 中的引号不动）"""
    # 在冒号前的引号包围的标识符
    return re.sub(r'"([a-zA-Z_][a-zA-Z0-9_]*)"\s*:', r'\1:', text)

gen1 = unquote_keys(gen1_raw)
gen2 = unquote_keys(gen2_raw)
sys.stderr.write('[4] Unquoted keys done\n')

# ------------------------------------------------------------------
# Step 5: 统计产品数量
# ------------------------------------------------------------------
sku_pat = re.compile(r'sku:\s*"')
orig_count = len(sku_pat.findall(orig))
gen1_count = len(sku_pat.findall(gen1))
gen2_count = len(sku_pat.findall(gen2))
total = orig_count + gen1_count + gen2_count
sys.stderr.write('[5] orig=%d gen1=%d gen2=%d total=%d\n' % (orig_count, gen1_count, gen2_count, total))
if total != 100:
    sys.stderr.write('[!] WARNING: expected 100, got %d\n' % total)

# ------------------------------------------------------------------
# Step 6: 拼接新产品（gen1 末尾已带 },\n）
# ------------------------------------------------------------------
# gen1: 多个 "  { ...  },\n" 对象（最后一个也带 },）
# gen2: 多个 "  { ...  }," 对象
# 在 gen1 后追加 \n\n + gen2（gen2 本身以 "  {" 开始）
new_products = gen1.rstrip('\r\n') + '\n\n' + gen2.lstrip()
sys.stderr.write('[6] new_products: %d chars\n' % len(new_products))

# ------------------------------------------------------------------
# Step 7: 替换 array close
# ------------------------------------------------------------------
new_content = orig.replace(arr_close, '  },\n' + new_products + '\n];')
sys.stderr.write('[7] new_content: %d chars\n' % len(new_content))

# ------------------------------------------------------------------
# Step 8: 写回文件
# ------------------------------------------------------------------
with open(PDATA, 'w', encoding='utf-8') as f:
    f.write(new_content)
sys.stderr.write('[8] Written OK\n')

# ------------------------------------------------------------------
# Step 9: 验证
# ------------------------------------------------------------------
with open(PDATA, 'r', encoding='utf-8') as f:
    verify = f.read()
final_count = len(sku_pat.findall(verify))
sys.stderr.write('[9] Final count: %d products\n' % final_count)
if final_count == 100:
    sys.stderr.write('[OK] SUCCESS: 100 products!\n')
else:
    sys.stderr.write('[!] ERROR: expected 100, got %d\n' % final_count)
    sys.exit(1)
sys.stderr.write('ALL DONE\n')
