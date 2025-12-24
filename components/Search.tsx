import { useState, useTransition, ChangeEvent } from 'react';
import { searchVerses } from '@/actions/search';
import Link from 'next/link';

interface SearchResultItem {
  href: string;
  title: string;
  sanskrit: string;
  translationEn: string;
  translationHi: string;
  description: string;
}

export default function Search() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    startTransition(async () => {
      if (newQuery.length > 2) {
        const searchResults = await searchVerses(newQuery);
        setResults(searchResults);
      } else {
        setResults([]);
      }
    });
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search verses..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
        />
        {isPending && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-5 w-5 border-2 border-primary-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((item) => (
            <li key={item.href} className="border-b last:border-b-0">
              <Link href={item.href} className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.translationEn}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}