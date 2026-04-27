"""
逐行处理 products-all.html：
1. 在每个 .pa-card div 中补全 data-sku/data-name（从后续 addToCart 提取）
2. 插入对比勾选框
"""
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

path = r"c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\products-all.html"

with open(path, encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
i = 0
inserted_cb = 0
added_attrs = 0
pending_sku = None
pending_brand = None
pending_name = None

while i < len(lines):
    line = lines[i]

    # 检测 pa-card div
    div_m = re.search(r'<div class="pa-card"([^>]*)>', line)
    if div_m:
        # 提取现有属性
        has_sku = 'data-sku=' in line
        has_cb = 'pa-compare-cb-wrap' in line
        div_attrs_str = div_m.group(1)

        # 从后续行提取 sku/brand/name（最多往后30行）
        if not has_sku:
            for j in range(i+1, min(i+30, len(lines))):
                m2 = re.search(r"addToCart\('([^']+)','([^']+)'", lines[j])
                if m2:
                    pending_sku = m2.group(1)
                    pending_brand = m2.group(2)
                    break
            # 提取 name（从 pa-card-name）
            for j in range(i+1, min(i+30, len(lines))):
                m3 = re.search(r'<h3 class="pa-card-name">([^<]+)</h3>', lines[j])
                if m3:
                    pending_name = m3.group(1)
                    break

        # 构造新 div 行
        if has_sku:
            new_lines.append(line)
        else:
            # 补全属性
            brand_m2 = re.search(r'data-brand="([^"]*)"', div_attrs_str)
            brand_val = brand_m2.group(1) if brand_m2 else (pending_brand.replace('\u2122','') if pending_brand else '')
            cert_m2 = re.search(r'data-cert="([^"]*)"', div_attrs_str)
            cert_val = cert_m2.group(1) if cert_m2 else ''
            type_m2 = re.search(r'data-type="([^"]*)"', div_attrs_str)
            type_val = type_m2.group(1) if type_m2 else ''

            new_div = f'<div class="pa-card"{div_attrs_str}'
            if pending_sku:
                new_div += f' data-sku="{pending_sku}"'
            if pending_name:
                new_div += f' data-name="{pending_name}"'
            new_div += '>\n'
            new_lines.append(new_div)
            added_attrs += 1
            inserted_cb += 1  # 新增了数据属性，计数
            # 插入 compare checkbox
            cb_html = (
                f'          <label class="pa-compare-cb-wrap" title="\u52a0\u5165\u5bf9\u6bd4">'
                f'<input type="checkbox" class="pa-compare-cb" '
                f'data-sku="{pending_sku}" data-name="{pending_name}" data-brand="{brand_val}" '
                f'data-cert="{cert_val}" data-type="{type_val}" onclick="toggleCompare(this,event)"></label>\n'
            )
            new_lines.append(cb_html)
            pending_sku = None; pending_brand = None; pending_name = None
            i += 1
            continue

        # 如果已有 sku，检查是否已有 compare checkbox
        if not has_cb:
            # 提取 sku/name/brand/cert/type
            sku_m2 = re.search(r'data-sku="([^"]*)"', line)
            name_m2 = re.search(r'data-name="([^"]*)"', line)
            brand_m3 = re.search(r'data-brand="([^"]*)"', line)
            cert_m3 = re.search(r'data-cert="([^"]*)"', line)
            type_m3 = re.search(r'data-type="([^"]*)"', line)
            sku_v = sku_m2.group(1) if sku_m2 else ''
            name_v = name_m2.group(1) if name_m2 else ''
            brand_v = brand_m3.group(1) if brand_m3 else ''
            cert_v = cert_m3.group(1) if cert_m3 else ''
            type_v = type_m3.group(1) if type_m3 else ''
            if sku_v:
                cb_html = (
                    f'          <label class="pa-compare-cb-wrap" title="\u52a0\u5165\u5bf9\u6bd4">'
                    f'<input type="checkbox" class="pa-compare-cb" '
                    f'data-sku="{sku_v}" data-name="{name_v}" data-brand="{brand_v}" '
                    f'data-cert="{cert_v}" data-type="{type_v}" onclick="toggleCompare(this,event)"></label>\n'
                )
                new_lines.append(cb_html)
                inserted_cb += 1

        new_lines.append(line)
        i += 1
        continue

    new_lines.append(line)
    i += 1

print(f"Added data-sku attrs to: {added_attrs} cards")
print(f"Inserted compare checkboxes: {inserted_cb}")
with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Done!")
