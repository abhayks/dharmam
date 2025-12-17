const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const NAV_START = '<!-- NAV_START -->';
const NAV_END = '<!-- NAV_END -->';

/**
 * Extracts the title from the frontmatter of an MDX file.
 * @param {string} filePath - The path to the MDX file.
 * @returns {string|null} The title or null if not found.
 */
function getTitleFromFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/title:\s*["'](.*?)["']/);
  return match ? match[1] : null;
}

/**
 * Generates the navigation markdown for a given verse.
 * @param {object|null} prevVerse - Info about the previous verse.
 * @param {object|null} nextVerse - Info about the next verse.
 * @param {string} lang - The language ('en' or 'hi').
 * @returns {string} The markdown for the navigation section.
 */
function generateNavMarkdown(prevVerse, nextVerse, lang) {
  const prevText = lang === 'hi' ? 'पिछला श्लोक' : 'Previous Verse';
  const nextText = lang === 'hi' ? 'अगला श्लोक' : 'Next Verse';

  const prevLink = prevVerse ? `← ${prevText}` : `<span></span>`;
  const nextLink = nextVerse ? `${nextText} →` : `<span></span>`;

  return `<div className="flex justify-between">
  ${prevLink}
  ${nextLink}
</div>`;
}

async function main() {
  console.log('\n🕉️  GITA VERSE NAVIGATION UPDATER  🕉️\n');

  const chapter = await ask('Chapter Number to update (e.g., 1): ');
  const chapterPath = path.join('content', 'smriti', 'mahabharata', 'bhagwad-geeta', `chapter-${chapter}`);

  if (!fs.existsSync(chapterPath)) {
    console.error(`\n❌ Error: Chapter folder does not exist: ${chapterPath}`);
    rl.close();
    return;
  }

  // 1. Find and sort all verse directories
  const verseDirs = fs.readdirSync(chapterPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('verse-'))
    .map(dirent => dirent.name)
    .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));

  if (verseDirs.length === 0) {
    console.log(`\n🤷 No verses found in Chapter ${chapter}. Nothing to update.`);
    rl.close();
    return;
  }

  console.log(`\nFound ${verseDirs.length} verses. Updating navigation...`);

  // 2. Create a list of verse data objects
  const verses = verseDirs.map(dir => {
    const verseNum = dir.split('-')[1];
    return {
      dirName: dir,
      num: verseNum,
      titleEn: getTitleFromFrontmatter(path.join(chapterPath, dir, 'post.en.mdx')),
      titleHi: getTitleFromFrontmatter(path.join(chapterPath, dir, 'post.hi.mdx')),
    };
  });

  // 3. Iterate through each verse and update its navigation
  for (let i = 0; i < verses.length; i++) {
    const currentVerse = verses[i];
    const prevVerseInfo = i > 0 ? { path: `../${verses[i-1].dirName}` } : null;
    const nextVerseInfo = i < verses.length - 1 ? { path: `../${verses[i+1].dirName}` } : null;

    // Update English and Hindi files
    for (const lang of ['en', 'hi']) {
      const filePath = path.join(chapterPath, currentVerse.dirName, `post.${lang}.mdx`);

      if (!fs.existsSync(filePath)) {
        console.warn(`  - Skipping missing file: ${filePath}`);
        continue;
      }

      let content = fs.readFileSync(filePath, 'utf-8');
      const navStartIndex = content.indexOf(NAV_START);
      const navEndIndex = content.indexOf(NAV_END);

      if (navStartIndex === -1 || navEndIndex === -1) {
        // If placeholders don't exist, append to the end of the file
        const navBlock = `\n---\n${NAV_START}\n${generateNavMarkdown(prevVerseInfo, nextVerseInfo, lang)}\n${NAV_END}`;
        content += navBlock;
      } else {
        // If placeholders exist, replace the content between them
        const newNavContent = generateNavMarkdown(prevVerseInfo, nextVerseInfo, lang);
        const preNav = content.substring(0, navStartIndex + NAV_START.length);
        const postNav = content.substring(navEndIndex);
        content = `${preNav}\n${newNavContent}\n${postNav}`;
      }

      fs.writeFileSync(filePath, content);
    }
    console.log(`  ✅ Updated navigation for Verse ${chapter}.${currentVerse.num}`);
  }

  console.log('\n✨ All verse navigation links updated successfully!');
  rl.close();
}

main();

```

### How to Use

1.  **Run the script**: Open your terminal and run the new script.
    ```bash
    node update-verse-navigation.js
    ```
2.  **Enter the Chapter Number**: When prompted, type the chapter number you want to update (e.g., `1` or `2`) and press Enter.
3.  **Check the Results**: The script will loop through every verse in that chapter and insert a clean, flexbox-based navigation component at the bottom of each `post.en.mdx` and `post.hi.mdx` file.

The script is idempotent, meaning you can run it as many times as you want. It will safely replace the existing navigation block without creating duplicates. This makes it easy to keep your navigation consistent as you add or modify verses.

<!--
[PROMPT_SUGGESTION]Refactor the `create-verse.js`, `create-chapter.js`, and the two update scripts to reduce code duplication.[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]How can I create a main landing page that lists all the chapters?[/PROMPT_SUGGESTION]
-->