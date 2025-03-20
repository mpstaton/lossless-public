#!/bin/bash
DIR="src/assets/visuals-as-components/tooling-trademarks"

# Count total files before cleanup
TOTAL_BEFORE=$(find "$DIR" -type f -name "*.astro" | wc -l)
echo "Total files before cleanup: $TOTAL_BEFORE"

# Find files that do not start with trademark__
echo "Files that do not start with trademark__:"
NON_TRADEMARK_FILES=$(find "$DIR" -type f -name "*.astro" | grep -v "trademark__")
echo "$NON_TRADEMARK_FILES" | sed 's/^/- /'
NON_TRADEMARK_COUNT=$(echo "$NON_TRADEMARK_FILES" | grep -c .)
echo "Count: $NON_TRADEMARK_COUNT"
echo ""

# Find files with spaces in their names
echo "Files with spaces in their names:"
SPACE_FILES=$(find "$DIR" -type f -name "* *.astro")
echo "$SPACE_FILES" | sed 's/^/- /'
SPACE_COUNT=$(echo "$SPACE_FILES" | grep -c .)
echo "Count: $SPACE_COUNT"
echo ""

# Ask for confirmation
echo "This script will remove the files listed above."
read -p "Do you want to proceed? (y/n): " CONFIRM
if [[ "$CONFIRM" != "y" ]]; then
  echo "Operation cancelled."
  exit 0
fi

# Remove files that do not start with trademark__
echo "Removing files that do not start with trademark__..."
echo "$NON_TRADEMARK_FILES" | xargs rm -v

# Remove files with spaces in their names (only if they start with trademark__)
echo "Removing files with spaces in their names..."
echo "$SPACE_FILES" | grep "trademark__" | xargs rm -v

# Count total files after cleanup
TOTAL_AFTER=$(find "$DIR" -type f -name "*.astro" | wc -l)
echo "Total files after cleanup: $TOTAL_AFTER"
echo "Removed $(($TOTAL_BEFORE - $TOTAL_AFTER)) files." 