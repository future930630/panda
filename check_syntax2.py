import sys
sys.stdout.reconfigure(encoding='utf-8')

# Check all JS files for syntax issues
files = {
    'products-all.js': r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\products-all.js',
    'i18n.js': r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\i18n.js',
}

for name, path in files.items():
    with open(path, 'rb') as f:
        raw = f.read()
    print(f'\n=== {name} ===')
    print(f'File size: {len(raw)} bytes')
    print(f'BOM: {raw[:3]}')
    print(f'First 4 bytes hex: {raw[:4].hex()}')

    # Check for BOM
    if raw[:3] == b'\xef\xbb\xbf':
        content = raw[3:].decode('utf-8')
        print('Encoding: UTF-8 with BOM')
    elif raw[:2] == b'\xff\xfe':
        print('Encoding: UTF-16 LE - PROBLEM!')
        content = raw[2:].decode('utf-16-le', errors='replace')
    else:
        try:
            content = raw.decode('utf-8')
            print('Encoding: UTF-8 no BOM')
        except:
            print('Encoding: Unknown - trying latin1')
            content = raw.decode('latin-1')

    # Show lines around reported errors
    lines = content.split('\n')
    print(f'Total lines: {len(lines)}')
    if name == 'products-all.js':
        print(f'Line 2: {repr(lines[1][:80])}')
        print(f'Line 325-330:')
        for i in range(324, 330):
            if i < len(lines):
                print(f'  {i+1}: {repr(lines[i][:100])}')
    if name == 'i18n.js':
        print(f'Line 1639: {repr(lines[1638][:80])}')
        print(f'Line 4685-4690:')
        for i in range(4684, 4690):
            if i < len(lines):
                print(f'  {i+1}: {repr(lines[i][:100])}')
        # Find Korean section
        for i, line in enumerate(lines):
            if "ko: {" in line or "'ko'" in line:
                print(f'  Korean section starts at line {i+1}: {repr(line[:60])}')
                # Check next 5 lines
                for j in range(i, min(i+6, len(lines))):
                    print(f'    {j+1}: {repr(lines[j][:100])}')
                break
