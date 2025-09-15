#!/bin/bash
#
# dumpall - Display contents of files with separators
#
# USAGE:
#   dumpall <file_or_directory>
#
# DESCRIPTION:
#   Displays the contents of all files in a directory, or a single file,
#   with clear separators between each file. Shows the full file path
#   followed by its contents and a separator line.
#
# EXAMPLES:
#   dumpall /path/to/directory    # Show all files in directory
#   dumpall file.txt              # Show single file
#   dumpall . | clip              # Copy output to clipboard (Git Bash/Windows)
#
# OUTPUT FORMAT:
#   path/to/file1
#   <file1 content>
#   
#   ---
#   
#   path/to/file2
#   <file2 content>
#   
#   ---
#
# NOTES:
#   - Recursively processes subdirectories
#   - Skips binary files gracefully
#   - Works in Git Bash, Linux, macOS, and WSL
#

# Check if argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: dumpall <file_or_directory>"
    echo "Try 'dumpall --help' for more information"
    exit 1
fi

# Show help if requested
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    sed -n '2,30p' "$0" | sed 's/^# //' | sed 's/^#//'
    exit 0
fi

# Main functionality
if [ -f "$1" ]; then
    echo "$1"
    cat "$1"
    echo
    echo "---"
    echo
elif [ -d "$1" ]; then
    find "$1" -type f -exec sh -c 'echo "{}"; cat "{}"; echo; echo "---"; echo' \;
else
    echo "Error: '$1' is not a file or directory"
    exit 1
fi