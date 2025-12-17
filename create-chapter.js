const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper to ask questions
const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

async function main() {
  console.log("\n🕉️  GITA CHAPTER GENERATOR  🕉️\n");

  // 1. Get Details
  const chapter = await ask("Chapter Number (e.g. 2): ");
  
  const chapterPath = path.join('content', 'smriti', 'mahabharata', 'bhagwad-geeta', `chapter-${chapter}`);

  // Check if Chapter exists
  if (fs.existsSync(chapterPath)) {
    console.warn(`\n⚠️  Warning: Chapter folder already exists: ${chapterPath}`);
    const overwrite = await ask("Do you want to create/overwrite index files? (y/n): ");
    if (overwrite.toLowerCase() !== 'y') {
      console.log("Operation cancelled.");
      rl.close();
      return;
    }
  }

  // 2. Get Content
  console.log("\n--- CONTENT DETAILS ---");
  const titleEn = await ask("English Title (e.g. Sankhya Yoga): ");
  const descEn = await ask("English Description (short): ");
  
  const titleHi = await ask("Hindi Title (e.g. सांख्य योग): ");
  const descHi = await ask("Hindi Description: ");
  
  // 3. Create English MDX
  const mdxEn = `---
title: "Chapter ${chapter}: ${titleEn}"
description: "${descEn}"
date: "2024-01-01"
---

# Chapter ${chapter}: ${titleEn}

## Description

*(This is a placeholder for a detailed description of the chapter. You can replace this with the kind of "meaty" content we created for Chapters 1 and 2.)*

## Verses

<!-- VERSE_LIST_START -->
<!-- This list is automatically generated. Do not edit manually. -->
<!-- VERSE_LIST_END -->
`;

  // 4. Create Hindi MDX
  const mdxHi = `---
title: "अध्याय ${chapter}: ${titleHi}"
description: "${descHi}"
date: "2024-01-01"
---

# अध्याय ${chapter}: ${titleHi}

## विवरण

*(यह अध्याय के विस्तृत विवरण के लिए एक प्लेसहोल्डर है।)*

## श्लोक

<!-- VERSE_LIST_START -->
<!-- यह सूची स्वचालित रूप से उत्पन्न होती है। मैन्युअल रूप से संपादित न करें। -->
<!-- VERSE_LIST_END -->
`;

  // 5. Write Files
  if (!fs.existsSync(chapterPath)){
    fs.mkdirSync(chapterPath, { recursive: true });
  }

  fs.writeFileSync(path.join(chapterPath, 'index.en.mdx'), mdxEn);
  fs.writeFileSync(path.join(chapterPath, 'index.hi.mdx'), mdxHi);

  console.log(`\n✅ Success! Created Chapter ${chapter} landing page at:`);
  console.log(`   ${chapterPath}`);

  rl.close();
}

main();