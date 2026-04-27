import os
import re

root = r"c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0"
count = 0
for fname in os.listdir(root):
    if not fname.endswith('.html'):
        continue
    fpath = os.path.join(root, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = content.replace('?v=20260417-FINAL', '?v=20260424-avatar').replace('?v=20260421-nav', '?v=20260424-avatar')
    if new_content != content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1
        print(f"Updated: {fname}")

print(f"Done. {count} files updated.")
