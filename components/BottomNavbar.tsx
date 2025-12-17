import { useState } from 'react';
import SearchModal from './SearchModal';

// Simple SVG icons for demonstration purposes
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function BottomNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* The navigation bar, visible only on smaller screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t shadow-lg flex justify-around items-center z-30">
        <a href="/" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
          <HomeIcon />
          <span className="text-xs">Home</span>
        </a>
        <button 
          onClick={() => setIsSearchOpen(true)} 
          className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
        >
          <SearchIcon />
          <span className="text-xs">Search</span>
        </button>
      </div>

      {/* The Search Modal, which is controlled by the navbar */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}