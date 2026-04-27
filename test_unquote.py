# -*- coding: utf-8 -*-
import re, sys

def unquote_keys(text):
    return re.sub(r'"([a-zA-Z_][a-zA-Z0-9_]*)"\s*:', r'\1:', text)

test = '  {\n    "sku": "shield-ANSI-A3",\n    "id": "shield-ANSI-A3",\n    "name_en": "PandaSHIELD Cut Resistant Glove",'
result = unquote_keys(test)
sys.stderr.write('Before: %s\n' % repr(test[:50]))
sys.stderr.write('After: %s\n' % repr(result[:50]))
sys.stderr.write('Has quoted key after: %s\n' % ('"sku":' in result))

# Now test with actual gen1
import os
base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
with open(os.path.join(base, '_gen1_output.txt'), 'rb') as f:
    raw1 = f.read()
gen1_raw = raw1.decode('utf-16-le', errors='ignore').lstrip('\ufeff').lstrip('\ufffe')
if gen1_raw.startswith('Generated'):
    gen1_raw = gen1_raw[gen1_raw.index('\n')+1:].lstrip()
sys.stderr.write('gen1 first 200 raw: %s\n' % repr(gen1_raw[:200]))

gen1_after = unquote_keys(gen1_raw)
sys.stderr.write('gen1 first 200 after unquote: %s\n' % repr(gen1_after[:200]))
sys.stderr.write('Has quoted sku after: %s\n' % ('"sku":' in gen1_after[:200]))
