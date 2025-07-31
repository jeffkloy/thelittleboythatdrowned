#!/usr/bin/env python3
"""
Generate a JSON file listing all poems in the poetry directory.
Run this script whenever you add or remove poems.
"""

import os
import json

def generate_poem_list():
    poetry_dir = 'poetry'
    output_file = os.path.join(poetry_dir, 'poems.json')
    
    # Get all .md files in the poetry directory
    poems = []
    if os.path.exists(poetry_dir):
        for filename in os.listdir(poetry_dir):
            if filename.endswith('.md') and filename != 'README.md':
                poems.append(filename)
    
    # Sort poems alphabetically
    poems.sort()
    
    # Create the JSON structure
    poem_data = {
        "poems": poems,
        "count": len(poems),
        "generated": True
    }
    
    # Write to JSON file
    with open(output_file, 'w') as f:
        json.dump(poem_data, f, indent=2)
    
    print(f"Generated {output_file} with {len(poems)} poems")
    return poems

if __name__ == "__main__":
    poems = generate_poem_list()
    print("\nPoems found:")
    for poem in poems:
        print(f"  - {poem}")