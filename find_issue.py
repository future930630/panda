import sys
with open(r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\i18n.js', encoding='utf-8') as f:
    lines = f.read().split('\n')

print("Lines 1610-1645:")
for i, line in enumerate(lines[1609:1645], 1610):
    print(f"{i}: {repr(line)}")

print("\nSearching for missing commas in language blocks...")
for i, line in enumerate(lines, 1):
    stripped = line.strip()
    if stripped.endswith('const,') or stripped.endswith('var,') or stripped.endswith('let,'):
        print(f"Line {i}: trailing comma issue: {repr(line)}")
    if '  ,' in line and not line.strip().startswith('//'):
        print(f"Line {i}: double comma: {repr(line)}")

print("\nSearching for I18N object structure...")
zh_open = next((i+1 for i, l in enumerate(lines) if '  zh: {' in l or l.strip() == 'zh: {'), None)
fr_open = next((i+1 for i, l in enumerate(lines) if '  fr: {' in l or l.strip() == 'fr: {'), None)
print(f"zh: opens at line {zh_open}, fr: opens at line {fr_open}")
if zh_open and fr_open:
    print(f"Between zh and fr (closing of zh):")
    for i in range(zh_open, min(fr_open+5, len(lines))):
        print(f"  {i+1}: {repr(lines[i])}")
