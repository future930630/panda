import sys, re
p = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\products-all.html'
with open(p, encoding='utf-8') as f:
    c = f.read()
s = c.find('<div class="pa-cert-content"')
e = c.find('<div class="pa-filter-card"', s+1)
cert = c[s:e]
n = 0
def fix(m):
    global n
    t = m.group(0)
    if 'data-dim="cert"' in t:
        return t
    # insert data-dim after type="checkbox"
    t2 = t.replace('type="checkbox"', 'type="checkbox" data-dim="cert"', 1)
    n += 1
    return t2
new_cert = re.sub(r'<input\s+[^>]*>', fix, cert)
new_c = c[:s] + new_cert + c[e:]
with open(p, 'w', encoding='utf-8') as f:
    f.write(new_c)
print(n)
