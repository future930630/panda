# -*- coding: utf-8 -*-
path = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\products-all.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Find cert section
s = c.find('<div class="pa-cert-content"')
e = c.find('<div class="pa-filter-card"', s + 1)
before = c[:s]
cert = c[s:e]
after = c[e:]

# Replace all <input type="checkbox" in cert section (add data-dim="cert")
n = 0
def repl(m):
    global n
    t = m.group(0)
    if 'data-dim="cert"' not in t:
        t = t.replace('type="checkbox"', 'type="checkbox" data-dim="cert"', 1)
        n += 1
    return t
import re
new_cert = re.sub(r'<input\b[^>]*>', repl, cert)

new_c = before + new_cert + after
with open(path, 'w', encoding='utf-8') as f:
    f.write(new_c)
print(f'Done, added data-dim to {n} checkboxes')
