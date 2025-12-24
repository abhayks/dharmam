const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const VERSE_LIST_START = '{/* VERSE_LIST_START */}';
const VERSE_LIST_END = '{/* VERSE_LIST_END */}';

/**
 * Extracts the title from the frontmatter of an MDX file.
 * @param {string} filePath - The path to the MDX file.
 * @returns {string|null} The title or null if not found.
 */
function getTitleFromFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/title:\s*["'](.*)["']/);
  return match ? match[1] : null;
}

/**
 * Finds the correct chapter landing page file (post.*.mdx or index.*.mdx).
 * @param {string} chapterPath - The path to the chapter directory.
 * @param {string} lang - The language ('en' or 'hi').
 * @returns {string|null} The full path to the file or null.
 */
function findChapterFile(chapterPath, lang) {
  const postFile = path.join(chapterPath, `post.${lang}.mdx`);
  if (fs.existsSync(postFile)) return postFile;
  const indexFile = path.join(chapterPath, `index.${lang}.mdx`);
  if (fs.existsSync(indexFile)) return indexFile;
  return null;
}

async function main() {
  console.log('\n🕉️  GITA CHAPTER LINK UPDATER  🕉️\n');

  const chapter = await ask('Chapter Number to update (e.g., 2): ');
  const chapterPath = path.join('content', 'smriti', 'mahabharata', 'bhagwad-geeta', `chapter-${chapter}`);

  if (!fs.existsSync(chapterPath)) {
    console.error(`\n❌ Error: Chapter folder does not exist: ${chapterPath}`);
    rl.close();
    return;
  }

  // 1. Find all verse directories
  const verseDirs = fs.readdirSync(chapterPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('Shloak-'))
    .map(dirent => dirent.name)
    .sort((a, b) => {
      const numA = parseInt(a.split('-')[1]);
      const numB = parseInt(b.split('-')[1]);
      return numA - numB;
    });

  if (verseDirs.length === 0) {
    console.log(`\n🤷 No verses found in Chapter ${chapter}. Nothing to update.`);
    rl.close();
    return;
  }
  console.log(`\nFound ${verseDirs.length} verses. Generating links...`);

  // 2. Generate link lists for both languages
  const links = { en: [], hi: [] };

  for (const verseDir of verseDirs) {
    const verseNum = verseDir.split('-')[1];
    const titleEn = getTitleFromFrontmatter(path.join(chapterPath, verseDir, 'post.en.mdx'));
    const titleHi = getTitleFromFrontmatter(path.join(chapterPath, verseDir, 'post.hi.mdx'));

    if (titleEn) {
      links.en.push(`* ${titleEn}`);
    }
    if (titleHi) {
      links.hi.push(`* ${titleHi}`);
    }
  }

  // 3. Update the chapter files
  for (const lang of ['en', 'hi']) {
    const chapterFile = findChapterFile(chapterPath, lang);
    if (!chapterFile) {
      console.warn(`\n⚠️  Warning: Chapter file for '${lang}' not found in ${chapterPath}. Skipping.`);
      continue;
    }

    let content = fs.readFileSync(chapterFile, 'utf-8');
    const listStartIndex = content.indexOf(VERSE_LIST_START);
    const listEndIndex = content.indexOf(VERSE_LIST_END);

    if (listStartIndex === -1 || listEndIndex === -1) {
      console.warn(`\n⚠️  Warning: Placeholders not found in ${path.basename(chapterFile)}. Skipping.`);
      continue;
    }

    const newContent = `${content.substring(0, listStartIndex + VERSE_LIST_START.length)}\n\n${links[lang].join('\n')}\n\n${content.substring(listEndIndex)}`;
    fs.writeFileSync(chapterFile, newContent);
    console.log(`✅ Updated: ${path.basename(chapterFile)}`);
  }

  console.log('\n✨ All done!');
  rl.close();
}

main();