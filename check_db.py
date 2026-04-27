import sqlite3
conn = sqlite3.connect(r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\serve_app\pandashield.db')
cur = conn.cursor()
# First get column names
cur.execute("PRAGMA table_info(Products)")
cols = [row[1] for row in cur.fetchall()]
print('Columns:', cols)
# Search for products containing '防切割'
cur.execute("SELECT sku, name_zh, brand, specs FROM Products WHERE name_zh LIKE '%防切割%' LIMIT 5")
rows = cur.fetchall()
print('Products with 防切割:')
for row in rows:
    print('  sku:', row[0], '| name_zh:', row[1], '| brand:', row[2], '| specs:', str(row[3])[:200] if row[3] else 'NULL')
conn.close()