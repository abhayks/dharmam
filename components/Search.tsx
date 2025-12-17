import { useState, useEffect, ChangeEvent } from 'react';
import Fuse from 'fuse.js';

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

export default function Search() {
  const [fuse, setFuse] = useState<Fuse<SearchResultItem> | null>(null);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Fuse.FuseResult<SearchResultItem>[]>([]);

  useEffect(() => {
    // Fetch the search index and initialize Fuse.js
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data: SearchResultItem[]) => {
        const fuseInstance = new Fuse(data, {
          keys: ['title', 'sanskrit', 'translationEn', 'translationHi', 'description'],
          includeScore: true,
          threshold: 0.4, // Adjust this for more/less strict matching
        });
        setFuse(fuseInstance);
      });
  }, []);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    if (fuse && newQuery.length > 2) {
      const searchResults = fuse.search(newQuery);
      // Limit to top 5 results
      setResults(searchResults.slice(0, 5));
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search verses..."
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          {results.map(({ item }) => (
            <li key={item.href} className="border-b last:border-b-0">
              <a href={item.href} className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.translationEn}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}