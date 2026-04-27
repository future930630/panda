# -*- coding: utf-8 -*-
import os, re, sys
sys.stdout.reconfigure(encoding='utf-8')

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
G1 = os.path.join(base, '_gen1_output.txt')

def unquote_keys(text):
    return re.sub(r'"([a-zA-Z_][a-zA-Z0-9_]*)"\s*:', r'\1:', text)

with open(G1, 'rb') as f:
    raw1 = f.read()
gen1_raw = raw1.decode('utf-16-le', errors='ignore').lstrip('\ufeff').lstrip('\ufffe')
# gen1 starts with 'Generated...' or '\nGenerated...'
sys.stderr.write('gen1_raw starts: %s\n' % repr(gen1_raw[:30]))
if gen1_raw.startswith('Generated'):
    gen1_raw = gen1_raw[gen1_raw.index('\n')+1:].lstrip()
sys.stderr.write('After strip header: starts=%s\n' % repr(gen1_raw[:30]))

gen1 = unquote_keys(gen1_raw)
sys.stderr.write('After unquote: starts=%s\n' % repr(gen1[:50]))
sys.stderr.write('gen1 has "sku": in first 50: %s\n' % ('"sku":' in gen1[:50]))
sys.stderr.write('gen1 has sku: in first 50: %s\n' % ('sku:' in gen1[:50]))
