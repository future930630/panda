# -*- coding: utf-8 -*-
import os, re, sys
base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'

with open(os.path.join(base, '_gen1_output.txt'), 'rb') as f:
    raw1 = f.read()
gen1 = raw1.decode('utf-16-le', errors='ignore').lstrip('\ufeff').lstrip('\ufffe').strip()
sys.stderr.write('First 500 chars of gen1: %s\n' % repr(gen1[:500]))

pat1 = re.compile(r'sku:\s*"')
pat2 = re.compile(r'"sku":\s*"')
sys.stderr.write('Count with unquoted sku: %d\n' % len(pat1.findall(gen1)))
sys.stderr.write('Count with quoted sku: %d\n' % len(pat2.findall(gen1)))

with open(os.path.join(base, '_gen2_trimmed.txt'), 'r', encoding='utf-8') as f:
    gen2 = f.read().strip()
sys.stderr.write('First 300 chars of gen2: %s\n' % repr(gen2[:300]))
sys.stderr.write('Count gen2 unquoted sku: %d\n' % len(pat1.findall(gen2)))
sys.stderr.write('Count gen2 quoted sku: %d\n' % len(pat2.findall(gen2)))
