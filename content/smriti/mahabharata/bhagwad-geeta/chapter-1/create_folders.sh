#!/bin/bash

# This script creates the directory structure for Bhagavad Gita, Chapter 1, Shlokas 11-47.

# Define the base path where the chapter folders are located.
# Please adjust this path if your project is in a different location.
BASE_PATH="/Users/abhaysrivastava/Documents/nextjs/dharmam/content/smriti/mahabharata/bhagwad-geeta/chapter-1"

# Loop from 11 to 47 to create a folder for each shloka.
for i in {11..47}
do
  # The -p flag ensures that the command doesn't fail if the directory already exists.
  mkdir -p "${BASE_PATH}/Shloak-${i}"
  echo "Created directory: ${BASE_PATH}/Shloak-${i}"
done

echo "Folder creation complete."
