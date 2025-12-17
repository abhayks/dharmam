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
  console.log("\n🕉️  GITA VERSE GENERATOR  🕉️\n");

  // 1. Get Details
  const chapter = await ask("Chapter Number (e.g. 1): ");
  const verse = await ask("Verse Number (e.g. 11): ");
  
  const folderName = `verse-${verse}`;
  const parentPath = path.join('content', 'smriti', 'mahabharata', 'bhagwad-geeta', `chapter-${chapter}`);
  const fullPath = path.join(parentPath, folderName);

  // Check if Chapter exists
  if (!fs.existsSync(parentPath)) {
    console.error(`\n❌ Error: Chapter folder does not exist: ${parentPath}`);
    console.error("Please create the chapter folder first.");
    rl.close();
    return;
  }

  // 2. Get Content
  console.log("\n--- CONTENT DETAILS ---");
  const titleEn = await ask("English Title (e.g. The Conch Shells): ");
  const descEn = await ask("English Description (short): ");
  const translationEn = await ask("English Translation of Verse: ");
  
  const titleHi = await ask("Hindi Title: ");
  const descHi = await ask("Hindi Description: ");
  const translationHi = await ask("Hindi Translation of Verse: ");
  
  const sanskrit = await ask("Sanskrit Shloka (paste in one line if possible): ");
  const audioFile = `gita-${chapter}-${verse}.mp3`;

  // 3. Create English MDX
  const mdxEn = `---
title: "Verse ${chapter}.${verse}: ${titleEn}"
description: "${descEn}"
date: "2024-01-01"
---

# ${titleEn}

<ShlokaCard 
  sanskrit="${sanskrit}"
  en="${translationEn}"
  hi="${translationHi}"
  audioSrc="/audio/${audioFile}"
/>

## Description
**${chapter}.${verse}**

*(Add your poetic description here)*

---
<!-- NAV_START -->
<!-- This navigation is automatically generated. Do not edit manually. -->
<!-- NAV_END -->
`;

  // 4. Create Hindi MDX
  const mdxHi = `---
title: "श्लोक ${chapter}.${verse}: ${titleHi}"
description: "${descHi}"
date: "2024-01-01"
---

# ${titleHi}

<ShlokaCard 
  sanskrit="${sanskrit}"
  en="${translationEn}"
  hi="${translationHi}"
  audioSrc="/audio/${audioFile}"
/>

## व्याख्या
**${chapter}.${verse}**

*(यहाँ विवरण जोड़ें)*

---
<!-- NAV_START -->
<!-- यह नेविगेशन स्वचालित रूप से उत्पन्न होता है। मैन्युअल रूप से संपादित न करें। -->
<!-- NAV_END -->
`;

  // 5. Write Files
  if (!fs.existsSync(fullPath)){
    fs.mkdirSync(fullPath);
  }

  fs.writeFileSync(path.join(fullPath, 'post.en.mdx'), mdxEn);
  fs.writeFileSync(path.join(fullPath, 'post.hi.mdx'), mdxHi);

  console.log(`\n✅ Success! Created Verse ${chapter}.${verse} at:`);
  console.log(`   ${fullPath}`);
  console.log(`\nDon't forget to add the audio file: public/audio/${audioFile}`);

  rl.close();
}

main();
