import sys
sys.stdout.reconfigure(encoding='utf-8')

base = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'

# Check i18n.js BOM
with open(base + r'\i18n.js', 'rb') as f:
    raw = f.read()
print(f'i18n.js BOM: {raw[:4].hex()}')
print(f'i18n.js size: {len(raw)} bytes')
# Count actual lines
content = raw.decode('utf-8-sig')  # strip BOM
actual_lines = content.split('\n')
print(f'Actual line count: {len(actual_lines)}')
# Show last 10 lines
print('Last 10 lines:')
for i, l in enumerate(actual_lines[-10:], len(actual_lines)-9):
    print(f'  {i}: {repr(l[:80])}')

# Check i18n.js structure around ko closing
print()
for i, l in enumerate(actual_lines):
    stripped = l.rstrip('\r')
    spaces = len(l) - len(l.lstrip())
    if i >= 4683 and i <= 4693:
        print(f'  {i+1}: ({spaces}sp) {repr(stripped[:80])}')
    # Find ko: {
    if stripped.startswith('ko:') or stripped == 'ko: {':
        print(f'  Found ko: at line {i+1}')
