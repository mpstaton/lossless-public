#!/bin/bash
DIR="src/assets/visuals-as-components/tooling-trademarks"
echo "Removing files that do not start with trademark__..."
find "$DIR" -type f -name "*.astro" | grep -v "trademark__" | xargs rm -v
echo "Removing files with spaces in their names..."
find "$DIR" -type f -name "* *.astro" | xargs rm -v
