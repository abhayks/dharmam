"use server";

import fs from "fs";
import path from "path";
import Fuse from "fuse.js";

/**
 * Defines the structure of each item in our search index.
 */
interface SearchResultItem {
    href: string;
    title: string;
    sanskrit: string;
    translationEn: string;
    translationHi: string;
    description: string;
}

let fuseIndex: Fuse<SearchResultItem> | null = null;

// Initialize Fuse index on the server (lazy loading)
function getFuseIndex() {
    if (fuseIndex) return fuseIndex;

    const publicDir = path.join(process.cwd(), "public");
    const filePath = path.join(publicDir, "search-index.json");

    if (!fs.existsSync(filePath)) {
        console.error("Search index file not found at:", filePath);
        return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent) as SearchResultItem[];

    fuseIndex = new Fuse(data, {
        keys: ["title", "sanskrit", "translationEn", "translationHi", "description"],
        includeScore: true,
        threshold: 0.4,
    });

    return fuseIndex;
}

export async function searchVerses(query: string) {
    if (!query || query.length < 3) return [];

    const fuse = getFuseIndex();
    if (!fuse) return [];

    const results = fuse.search(query);
    // Return top 5 results
    return results.slice(0, 5).map((result) => result.item);
}
