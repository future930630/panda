# -*- coding: utf-8 -*-
import re

with open('products.js', encoding='utf-8') as f:
    content = f.read()

# 提取 id, name.zh, price, salesVolume
pattern = re.compile(r'id:\s*"([^"]+)".*?name:\s*\{[^}]*?zh:\s*"([^"]+)".*?price:\s*([\d.]+).*?salesVolume:\s*(\d+)', re.DOTALL)
matches = pattern.findall(content)

data = {}
for m in matches:
    pid, name, price, sales = m
    data[pid] = {'name': name, 'price': float(price), 'sales': int(sales)}

print(f"共找到 {len(data)} 款产品")
for k, v in data.items():
    print(f"  {k}: ¥{v['price']}, 销量{v['sales']}")

# 读取 products-all.html，给每张卡片加 data-price data-sales
with open('products-all.html', encoding='utf-8') as f:
    html = f.read()

# 匹配所有 <div class="pa-card" ...>
# 找到对应的产品 id（从 href="product-detail.html?sku=XXX" 提取）
card_pattern = re.compile(r'(<div class="pa-card"[^>]+>)')
sku_pattern = re.compile(r'product-detail\.html\?sku=([^"&]+)')

def add_data_attrs(match):
    card_open = match.group(1)
    # 找紧接着的 sku
    after = html[match.end():match.end()+200]
    sku_m = sku_pattern.search(after)
    sku = sku_m.group(1) if sku_m else None
    if sku and sku in data:
        d = data[sku]
        # 加到 card_open 里
        card_open = card_open.rstrip('>') + f' data-price="{d["price"]}" data-sales="{d["sales"]}">'
    return card_open

html2 = card_pattern.sub(add_data_attrs, html)

with open('products-all.html', 'w', encoding='utf-8') as f:
    f.write(html2)

print("\n已更新 products-all.html，给所有卡片加上了 data-price 和 data-sales")
