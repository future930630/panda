import re

fp = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\products-all.html'

with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()

cert_start = content.find('<div class="pa-cert-content"')
cert_end = content.find('<!-- 品牌系列 -->')

print(f"cert 区域: {cert_start} ~ {cert_end}")

cert_section = content[cert_start:cert_end]
count = cert_section.count('<span class="pa-nav-checkmark"></span>')
print(f"cert 区域内多余的 span.pa-nav-checkmark 数量: {count}")

before = content[:cert_start]
after = content[cert_end:]
middle_cleaned = cert_section.replace('<span class="pa-nav-checkmark"></span>', '')

new_content = before + middle_cleaned + after

with open(fp, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("已写入，修复完成。")
