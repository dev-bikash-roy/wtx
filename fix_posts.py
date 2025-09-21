import re

# Read the file
with open(r'f:\wtx-next\src\data\posts-old.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove any orphaned lines with just "color: 'blue'"
# This regex looks for lines that contain only color: 'blue' (possibly with whitespace)
# and removes them along with any trailing newlines
pattern = r'^\s*color:\s*[\'"]blue[\'"]\s*[\r\n]+'
fixed_content = re.sub(pattern, '', content, flags=re.MULTILINE)

# Write the fixed content to a new file
with open(r'f:\wtx-next\src\data\posts-old.ts.fixed', 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("Fixed file created as posts-old.ts.fixed")