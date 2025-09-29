# Script to fix the corrupted posts.ts file
import os

# Read the old file (which is good) and the current file
with open('src/data/posts-old.ts', 'r', encoding='utf-8') as f:
    old_content = f.read()

# Write the old content to the current file
with open('src/data/posts.ts', 'w', encoding='utf-8') as f:
    f.write(old_content)

print("File has been fixed!")