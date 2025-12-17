import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface FolderItem {
  slug: string;
  title: string;
  description: string;
  href: string;
}

function walkDir(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

export function getPostPaths(lang: string) {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const allFiles = walkDir(CONTENT_DIR);
  const suffix = `post.${lang}.mdx`;

  return allFiles
    .filter((file) => file.endsWith(suffix))
    .map((file) => {
      const relativePath = file.replace(CONTENT_DIR, "").replace(/\\/g, "/");
      const slugPath = relativePath.replace(`/${suffix}`, "");
      return slugPath.split("/").filter(Boolean);
    });
}

export async function getPostData(lang: string, slug: string[]) {
  const targetFile = `post.${lang}.mdx`;
  const filePath = path.join(CONTENT_DIR, ...slug, targetFile);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(fileContent);

  return {
    content,
    frontmatter: data,
    slug: slug.join("/"),
  };
}

// --- FIX 1: Natural Sorting for Next/Prev Buttons ---
export async function getAdjacentPosts(lang: string, currentSlug: string[]) {
  const allPaths = getPostPaths(lang);

  // Sort using 'numeric: true' so "verse-2" comes after "verse-1" and before "verse-10"
  const sortedPaths = allPaths.sort((a, b) =>
    a.join("/").localeCompare(b.join("/"), undefined, { numeric: true })
  );

  const currentPathStr = currentSlug.join("/");
  const currentIndex = sortedPaths.findIndex(
    (p) => p.join("/") === currentPathStr
  );

  if (currentIndex === -1) return { prev: null, next: null };

  const prevSlug = currentIndex > 0 ? sortedPaths[currentIndex - 1] : null;
  const nextSlug =
    currentIndex < sortedPaths.length - 1
      ? sortedPaths[currentIndex + 1]
      : null;

  const getTitle = (slug: string[]) => {
    const filePath = path.join(CONTENT_DIR, ...slug, `post.${lang}.mdx`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);
      return data.title;
    }
    return slug[slug.length - 1];
  };

  return {
    prev: prevSlug ? { slug: prevSlug, title: getTitle(prevSlug) } : null,
    next: nextSlug ? { slug: nextSlug, title: getTitle(nextSlug) } : null,
  };
}

// --- FIX 2: Natural Sorting for Folder Lists ---
export function getFolderItems(slug: string[], lang: string): FolderItem[] {
  const folderPath = path.join(CONTENT_DIR, ...slug);

  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    return [];
  }

  const items = fs.readdirSync(folderPath);

  const mappedItems = items
    .map((item) => {
      const itemPath = path.join(folderPath, item);
      const isDirectory = fs.statSync(itemPath).isDirectory();
      if (!isDirectory) return null;

      const postPath = path.join(itemPath, `post.${lang}.mdx`);

      let title = item
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      let description = "";

      if (fs.existsSync(postPath)) {
        const content = fs.readFileSync(postPath, "utf8");
        const { data } = matter(content);
        title = data.title || title;
        description = data.description || "";
      }

      return {
        slug: item,
        title,
        description,
        href: `/${lang}/${slug.join("/")}/${item}`,
      };
    })
    .filter((item): item is FolderItem => item !== null);

  // Apply the Sort
  return mappedItems.sort((a, b) =>
    a.slug.localeCompare(b.slug, undefined, { numeric: true })
  );
}

// Need to update getAllPosts as well if you use search
export function getAllPosts(lang: string) {
  const paths = getPostPaths(lang);

  return paths
    .map((slug) => {
      const href = `/${lang}/${slug.join("/")}`;
      const postPath = path.join(CONTENT_DIR, ...slug, `post.${lang}.mdx`);
      if (!fs.existsSync(postPath)) return null;

      const fileContent = fs.readFileSync(postPath, "utf8");
      const { data } = matter(fileContent);

      return {
        title: data.title,
        description: data.description || "",
        href,
        category: slug[slug.length - 2]?.replace(/-/g, " ") || "General",
      };
    })
    .filter(Boolean);
}
