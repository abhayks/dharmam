const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Data: Verse counts for all 18 chapters
const VERSE_COUNTS = {
  2: 72,  3: 43,  4: 42,  5: 29,  6: 47,
  7: 30,  8: 28,  9: 34, 10: 42, 11: 55, 12: 20,
  13: 34, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

async function main() {
  console.log("\n🚀  GITA BULK GENERATOR  🚀\n");
  
  // 1. Ask for Chapter
  const chapterInput = await ask("Which Chapter do you want to generate? (1-18): ");
  const chapter = parseInt(chapterInput);

  if (!VERSE_COUNTS[chapter]) {
    console.error("❌ Invalid Chapter Number.");
    rl.close();
    return;
  }

  const totalVerses = VERSE_COUNTS[chapter];
  console.log(`\nGenerating ${totalVerses} folders for Chapter ${chapter}...\n`);

  // 2. Define Base Path
  const baseDir = path.join('content', 'smriti', 'mahabharata', 'bhagwad-geeta', `chapter-${chapter}`);

  // Create Chapter folder if missing
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
    console.log(`Created Chapter folder: ${baseDir}`);
  }

  // 3. Loop through all verses
  for (let i = 1; i <= totalVerses; i++) {
    const folderName = `verse-${i}`;
    const fullPath = path.join(baseDir, folderName);

    // Create Verse Folder
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
    }

    // --- ENGLISH TEMPLATE ---
    const enContent = `---
title: "Verse ${chapter}.${i}"
description: "Enter description here..."
date: "2024-01-01"
---

# Verse ${chapter}.${i}

<ShlokaCard 
  sanskrit="PASTE SANSKRIT HERE"
  en="PASTE ENGLISH TRANSLATION HERE"
  hi="PASTE HINDI TRANSLATION HERE"
  audioSrc="/audio/gita-${chapter}-${i}.mp3"
/>

## Description
**${chapter}.${i}**

(Add description)
`;

    // --- HINDI TEMPLATE ---
    const hiContent = `---
title: "श्लोक ${chapter}.${i}"
description: "विवरण यहाँ लिखें..."
date: "2024-01-01"
---

# श्लोक ${chapter}.${i}

<ShlokaCard 
  sanskrit="PASTE SANSKRIT HERE"
  en="PASTE ENGLISH TRANSLATION HERE"
  hi="PASTE HINDI TRANSLATION HERE"
  audioSrc="/audio/gita-${chapter}-${i}.mp3"
/>

## व्याख्या
**${chapter}.${i}**

(विवरण जोड़ें)
`;

    // Write files only if they don't exist (to prevent overwriting your work)
    if (!fs.existsSync(path.join(fullPath, 'post.en.mdx'))) {
      fs.writeFileSync(path.join(fullPath, 'post.en.mdx'), enContent);
    }
    if (!fs.existsSync(path.join(fullPath, 'post.hi.mdx'))) {
      fs.writeFileSync(path.join(fullPath, 'post.hi.mdx'), hiContent);
    }
    
    // Simple progress log
    process.stdout.write(`.`);
  }

  console.log(`\n\n✅ Done! Generated ${totalVerses} verse skeletons for Chapter ${chapter}.`);
  rl.close();
}

main();
