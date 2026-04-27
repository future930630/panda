import os
p1 = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0 - 副本\products-all.js'
p2 = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\products-all.js'

s1 = os.path.getsize(p1)
s2 = os.path.getsize(p2)

with open(p1, 'r', encoding='utf-8') as f:
    lines1 = f.readlines()
with open(p2, 'r', encoding='utf-8') as f:
    lines2 = f.readlines()

print(f'副本 products-all.js: {s1} bytes, {len(lines1)} lines')
print(f'当前 products-all.js:  {s2} bytes, {len(lines2)} lines')

# Check last 10 lines of each
print('\n--- 副本最后10行 ---')
for l in lines1[-10:]:
    print(repr(l[-60:]))

print('\n--- 当前最后10行 ---')
for l in lines2[-10:]:
    print(repr(l[-60:]))
