import os

os.chdir(r"c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0")

with open('i18n.js', 'rb') as f:
    data = f.read()

lines = data.split(b'\n')
print(f'Total lines: {len(lines)}')

# Check line 1639 (1-indexed)
if len(lines) > 1638:
    line = lines[1638]
    print(f'Line 1639 raw bytes: {repr(line[:120])}')

# Check surrounding lines
for i in range(1633, min(1643, len(lines))):
    print(f'Line {i+1}: {repr(lines[i][:80])}')

# Check encoding
print(f'File starts with BOM: {data[:3] == b"\xef\xbb\xbf"}')
print(f'First 20 bytes: {repr(data[:20])}')
