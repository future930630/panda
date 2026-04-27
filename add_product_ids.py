#!/usr/bin/env python3
"""修正 products-all.html：将所有 product-detail.html?sku= 替换为 ?id=，使用 data-id 属性映射"""
import re

FILE = r"c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\products-all.html"

SKU_TO_ID = {
    "SHD-N":   "hppe-cut5",
    "KEV-P":   "hppe-cut5",
    "DYN-W":   "hppe-cut5",
    "CHEM-N":  "nitrile-oil",
    "NOM-W":   "latex-heat",
    "THERM-T": "therm-t",
    "ECO-R":   "eco-r",
    "CHEM-E":  "chem-e",
    "DYN-A3":  "dyn-a3",
    "CHEM-O":  "chem-o",
    "THERM-F": "therm-f",
    "KEV-A6":  "kev-a6",
    "ECO-L":   "eco-l",
    "DYN-S":   "dyn-s",
    "CHEM-M":  "chem-m",
    "KEV-G":   "kev-g",
    "NOM-H3":  "nom-h3",
    "ECO-G":   "eco-g",
    "THERM-X": "therm-x",
}

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 1. 给每个 pa-card 添加 data-id（从 data-sku 映射）
def add_id_to_card(m):
    tag = m.group(0)
    sku_m = re.search(r'data-sku="([^"]+)"', tag)
    if sku_m:
        sku = sku_m.group(1)
        pid = SKU_TO_ID.get(sku, sku.lower())
        if 'data-id=' not in tag:
            tag = tag.replace('<div class="pa-card"', f'<div class="pa-card" data-id="{pid}"')
    return tag

content = re.sub(r'<div class="pa-card"[^>]*>', add_id_to_card, content)

# 2. 替换所有 ?sku= → ?id=
def fix_link(m):
    sku = m.group(1)
    pid = SKU_TO_ID.get(sku, sku.lower())
    return f'href="product-detail.html?id={pid}"'

content = re.sub(r'href="product-detail\.html\?sku=([^"]+)"', fix_link, content)

with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)

print("Done. Updated data-id attributes and all product-detail.html links")
