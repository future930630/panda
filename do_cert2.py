path = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\products-all.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

s = c.find('<div class="pa-cert-content"')
e = c.find('<div class="pa-filter-card"', s + 1)
before = c[:s]
cert = c[s:e]
after = c[e:]

n = 0
new_cert = ''
i = 0
while i < len(cert):
    idx = cert.find('<input type="checkbox"', i)
    if idx == -1:
        new_cert += cert[i:]
        break
    # Check if already has data-dim
    segment = cert[idx:idx+50]
    if 'data-dim="cert"' in segment:
        new_cert += cert[i:idx+len(segment)]
        i = idx + len(segment)
        continue
    # Add data-dim after type="checkbox"
    end = cert.find('>', idx)
    tag = cert[idx:end+1]
    new_tag = tag.replace('type="checkbox"', 'type="checkbox" data-dim="cert"', 1)
    new_cert += cert[i:idx] + new_tag
    i = end + 1
    n += 1

with open(path, 'w', encoding='utf-8') as f:
    f.write(before + new_cert + after)
print(n)
