const fs = require('fs');
const path = require('path');

// Configuration for Chapter 1
const CHAPTER_NUM = 1;
const TOTAL_VERSES = 47;
const BASE_PATH = path.join('content', 'smriti', 'mahabharata', 'bhagwad-geeta', `chapter-${CHAPTER_NUM}`);

function generate() {
  console.log(`\nChecking Chapter ${CHAPTER_NUM} structure...`);

  // 1. Ensure Chapter Folder Exists
  if (!fs.existsSync(BASE_PATH)) {
    fs.mkdirSync(BASE_PATH, { recursive: true });
    console.log(`Created parent folder: ${BASE_PATH}`);
  }

  // 2. Loop through all 47 verses
  for (let i = 1; i <= TOTAL_VERSES; i++) {
    const verseFolder = path.join(BASE_PATH, `Shloak-${i}`);
    
    // Create Verse Folder if missing
    if (!fs.existsSync(verseFolder)) {
      fs.mkdirSync(verseFolder);
    }

    // Define File Paths
    const enPath = path.join(verseFolder, 'post.en.mdx');
    const hiPath = path.join(verseFolder, 'post.hi.mdx');

    // --- English Template ---
    const enTemplate = `---
title: "Verse ${CHAPTER_NUM}.${i}"
description: "Description for verse ${CHAPTER_NUM}.${i}"
date: "2024-01-01"
---

# Verse ${CHAPTER_NUM}.${i}

<ShlokaCard 
  sanskrit="PASTE SANSKRIT SHLOKA HERE"
  en="PASTE ENGLISH TRANSLATION HERE"
  hi="PASTE HINDI TRANSLATION HERE"
  audioSrc="/audio/gita-${CHAPTER_NUM}-${i}.mp3"
/>

## Description
**${CHAPTER_NUM}.${i}**

(Add your poetic description or commentary here)
`;

    // --- Hindi Template ---
    const hiTemplate = `---
title: "श्लोक ${CHAPTER_NUM}.${i}"
description: "श्लोक ${CHAPTER_NUM}.${i} का विवरण"
date: "2024-01-01"
---

# श्लोक ${CHAPTER_NUM}.${i}

<ShlokaCard 
  sanskrit="PASTE SANSKRIT SHLOKA HERE"
  en="PASTE ENGLISH TRANSLATION HERE"
  hi="PASTE HINDI TRANSLATION HERE"
  audioSrc="/audio/gita-${CHAPTER_NUM}-${i}.mp3"
/>

## व्याख्या
**${CHAPTER_NUM}.${i}**

(यहाँ विवरण जोड़ें)
`;

    // 3. Write Files (SKIP if they already exist)
    if (!fs.existsSync(enPath)) {
      fs.writeFileSync(enPath, enTemplate);
      console.log(`✅ Created: verse-${i}/post.en.mdx`);
    } else {
      // Silent skip to avoid cluttering console, or uncomment below to see skips
      // console.log(`⏩ Skipped: verse-${i} (Already exists)`);
    }

    if (!fs.existsSync(hiPath)) {
      fs.writeFileSync(hiPath, hiTemplate);
      console.log(`✅ Created: verse-${i}/post.hi.mdx`);
    }
  }

  console.log(`\n🎉 Operation Complete for Chapter ${CHAPTER_NUM}!`);
}

generate();
