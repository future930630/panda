# -*- coding: utf-8 -*-
import re

path = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\products-all.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find cert section: from 'pa-cert-content' to next 'pa-filter-card'
cert_start = content.find('<div class="pa-cert-content"')
cert_end = content.find('<div class="pa-filter-card"', cert_start + 1)
cert_section = content[cert_start:cert_end]

# Count existing
existing = cert_section.count('data-dim="cert"')
print(f'Existing data-dim="cert" checkboxes: {existing}')

# Add data-dim="cert" to checkbox inputs that don't have it
def fix_line(m):
    inp = m.group(0)
    if 'data-dim="cert"' in inp:
        return inp
    # Insert data-dim after 'type="checkbox"'
    return inp.replace('type="checkbox"', 'type="checkbox" data-dim="cert"', 1)

new_cert_section = re.sub(r'<input\s+type="checkbox"[^>]*>', fix_line, cert_section)
new_count = new_cert_section.count('data-dim="cert"')
print(f'After fix: {new_count} data-dim="cert" checkboxes')

new_content = content[:cert_start] + new_cert_section + content[cert_end:]
with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Done')
