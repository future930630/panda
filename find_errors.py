import re

base = r'C:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
with open(base + '\\products-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Split into lines
lines = content.split('\n')

# Find ALL occurrences of "  }" (top-level product end without comma)
# and "  }," (top-level product end with comma)
no_comma_ends = []
comma_ends = []

for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == '}' or stripped == '},':
        # Check indent: should be 2 spaces for top-level object
        indent = len(line) - len(line.lstrip())
        if indent == 2:
            if stripped == '}':
                no_comma_ends.append(i+1)
            else:
                comma_ends.append(i+1)

print('Lines with "  }" (NO comma): %d' % len(no_comma_ends))
print('Lines with "  }," (WITH comma): %d' % len(comma_ends))

# The last top-level product should also end with "}," not "}"
# After the array of 100 products, we have "];\n"
# So: 99 products should end with "  }," and the last should end with "  },"
# Actually: ALL 100 products should end with "}," in the JS array (the last one ALSO has a comma)
# Wait no: in JS arrays, the last element CAN have a trailing comma

# Show all lines with "  }" (no comma)
print('\nNo-comma ends (line numbers):')
for ln in no_comma_ends:
    print('  Line %d: %s' % (ln, lines[ln-1].rstrip()))

# Check the LAST few lines before ];
last_brace_no_comma = [l for l in no_comma_ends if l > 4900]
print('\nNo-comma near end:')
for ln in last_brace_no_comma:
    print('  Line %d: %s' % (ln, lines[ln-1].rstrip()))
    # Show context
    for j in range(max(0, ln-3), min(len(lines), ln+3)):
        print('    [%d] %s' % (j+1, lines[j].rstrip()))
