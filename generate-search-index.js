const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join('content', 'smriti', 'mahabharata', 'bhagwad-geeta');
const PUBLIC_PATH = path.join('public');

/**
 * Extracts key information from a verse's MDX file.
 * @param {string} filePath - The path to the MDX file.
 * @returns {object|null} An object with extracted data or null.
 */
function extractVerseData(filePath) {
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf-8');

  const frontmatterMatch = content.match(/---([\s\S]*?)---/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const titleMatch = frontmatter.match(/title:\s*["'](.*?)["']/);
  const descriptionMatch = frontmatter.match(/description:\s*["'](.*?)["']/);

  const shlokaCardMatch = content.match(/<ShlokaCard([\s\S]*?)\/>/);
  const sanskritMatch = shlokaCardMatch ? shlokaCardMatch[1].match(/sanskrit="([^"]*)"/) : null;
  const enTranslationMatch = shlokaCardMatch ? shlokaCardMatch[1].match(/en="([^"]*)"/) : null;
  const hiTranslationMatch = shlokaCardMatch ? shloka-card-match[1].match(/hi="([^"]*)"/) : null;

  return {
    title: titleMatch ? titleMatch[1] : '',
    description: descriptionMatch ? descriptionMatch[1] : '',
    sanskrit: sanskritMatch ? sanskritMatch[1] : '',
    translationEn: enTranslationMatch ? enTranslationMatch[1] : '',
    translationHi: hiTranslationMatch ? hiTranslationMatch[1] : '',
  };
}

function main() {
  console.log('\n🕉️  GITA SEARCH INDEX GENERATOR  🕉️\n');

  const searchIndex = [];

  // 1. Find all chapter directories
  const chapterDirs = fs.readdirSync(BASE_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('chapter-'))
    .map(dirent => dirent.name);

  console.log(`Found ${chapterDirs.length} chapters. Scanning for verses...`);

  // 2. Iterate through chapters and verses
  for (const chapterDir of chapterDirs) {
    const chapterPath = path.join(BASE_PATH, chapterDir);
    const chapterNum = chapterDir.split('-')[1];

    const verseDirs = fs.readdirSync(chapterPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('verse-'))
      .map(dirent => dirent.name);

    for (const verseDir of verseDirs) {
      const verseNum = verseDir.split('-')[1];
      const versePath = path.join(chapterPath, verseDir);

      const dataEn = extractVerseData(path.join(versePath, 'post.en.mdx'));
      const dataHi = extractVerseData(path.join(versePath, 'post.hi.mdx'));

      if (dataEn && dataHi) {
        searchIndex.push({
          // URL to link to the verse page
          href: `/smriti/mahabharata/bhagwad-geeta/${chapterDir}/${verseDir}`,
          // Searchable content
          title: dataEn.title,
          sanskrit: dataEn.sanskrit,
          translationEn: dataEn.translationEn,
          translationHi: dataHi.translationHi,
          description: dataEn.description,
        });
      }
    }
  }

  // 3. Write the index to the public directory
  if (!fs.existsSync(PUBLIC_PATH)) {
    fs.mkdirSync(PUBLIC_PATH);
  }
  fs.writeFileSync(
    path.join(PUBLIC_PATH, 'search-index.json'),
    JSON.stringify(searchIndex, null, 2)
  );

  console.log(`\n✅ Generated search-index.json with ${searchIndex.length} verses.`);
  console.log('✨ Search index generation complete!');
}

main();