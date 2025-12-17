const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join('content', 'smriti', 'mahabharata', 'bhagwad-geeta');

/**
 * Extracts title and description from the frontmatter of an MDX file.
 * @param {string} filePath - The path to the MDX file.
 * @returns {{title: string, description: string}|null}
 */
function getFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  const titleMatch = content.match(/title:\s*["'](.*?)["']/);
  const descriptionMatch = content.match(/description:\s*["'](.*?)["']/);
  
  if (!titleMatch || !descriptionMatch) return null;

  return {
    title: titleMatch[1],
    description: descriptionMatch[1],
  };
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

function generateIndexPage(chapters, lang) {
  const isEn = lang === 'en';
  const mainTitle = isEn ? "The Bhagavad Gita: A Chapter-wise Summary" : "श्रीमद्भगवद्गीता: अध्याय-वार सार";
  const mainDesc = isEn ? "An overview of all 18 chapters of the sacred Bhagavad Gita." : "श्रीमद्भगवद्गीता के सभी १८ अध्यायों का अवलोकन।";
  const listHeader = isEn ? "## Chapters" : "## अध्याय";

  const chapterLinks = chapters.map(ch => {
    // Extract just the chapter title, e.g., "Karma Yoga" from "Chapter 3: Karma Yoga"
    const simpleTitle = ch.title.substring(ch.title.indexOf(':') + 1).trim();
    const chapterPrefix = isEn ? "Chapter" : "अध्याय";
    return `### ${chapterPrefix} ${ch.number}: ${simpleTitle}\n\n> ${ch.description}\n`;
  }).join('\n---\n\n');

  return `---
title: "${mainTitle}"
description: "${mainDesc}"
date: "${new Date().toISOString().split('T')[0]}"
---

# ${mainTitle}

${listHeader}

${chapterLinks}
`;
}

function main() {
  console.log('\n🕉️  GITA MAIN INDEX GENERATOR  🕉️\n');

  // 1. Find all chapter directories
  const chapterDirs = fs.readdirSync(BASE_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('chapter-'))
    .map(dirent => dirent.name)
    .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));

  if (chapterDirs.length === 0) {
    console.error('❌ No chapter directories found. Nothing to generate.');
    return;
  }

  console.log(`Found ${chapterDirs.length} chapters. Gathering information...`);

  // 2. Extract data for each chapter
  const chapters = { en: [], hi: [] };

  for (const dirName of chapterDirs) {
    const chapterPath = path.join(BASE_PATH, dirName);
    const chapterNum = dirName.split('-')[1];

    for (const lang of ['en', 'hi']) {
      const chapterFile = findChapterFile(chapterPath, lang);
      const frontmatter = chapterFile ? getFrontmatter(chapterFile) : null;
      if (frontmatter) {
        chapters[lang].push({
          number: chapterNum,
          dirName: dirName,
          ...frontmatter,
        });
      }
    }
  }

  // 3. Generate and write the main index files
  const indexContentEn = generateIndexPage(chapters.en, 'en');
  fs.writeFileSync(path.join(BASE_PATH, 'index.en.mdx'), indexContentEn);
  console.log('✅ Generated: index.en.mdx');

  const indexContentHi = generateIndexPage(chapters.hi, 'hi');
  fs.writeFileSync(path.join(BASE_PATH, 'index.hi.mdx'), indexContentHi);
  console.log('✅ Generated: index.hi.mdx');

  console.log('\n✨ Main landing pages created successfully!');
}

main();