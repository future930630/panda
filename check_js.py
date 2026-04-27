import sys
path = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\products-data.js'
try:
    with open(path, encoding='utf-8') as f:
        c = f.read()
    lines = c.split('\n')
    print(f'Total lines: {len(lines)}')
    print(f'File ends: {repr(c[-100:])}')
    print(f'Braces: open={c.count("{")}, close={c.count("}")}, diff={c.count("{")-c.count("}")}')
    print(f'Brackets: open={c.count("[")}, close={c.count("]")}, diff={c.count("[")-c.count("]")}')
    # Check for obvious syntax issues
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith('return ') and not any(x in stripped for x in ['function', '=>', '{']):
            print(f'Line {i}: Suspicious standalone return: {stripped[:60]}')
    print('DONE')
except Exception as e:
    print(f'ERROR: {e}')