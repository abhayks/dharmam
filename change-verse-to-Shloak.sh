find . -type d -name "verse*" | while read d; do
    base=$(basename "$d")
    parent=$(dirname "$d")
    new=$(echo "$base" | sed 's/^verse/Shloak/')
    mv "$d" "$parent/$new"
done
