"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // 1. Determine Current Language
  const currentLang = pathname.split('/')[1] || 'en';
  const targetLang = currentLang === 'en' ? 'hi' : 'en';
  const targetLabel = currentLang === 'en' ? 'हिंदी' : 'English';

  // 2. Generate the URL for the other language
  // Replaces /en/section... with /hi/section...
  const switchUrl = pathname.replace(`/${currentLang}`, `/${targetLang}`);

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 border-t-2 border-saffron-border bg-saffron-surface shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        
        {/* BUTTON 1: BACK */}
        <button 
          onClick={() => router.back()}
          className="flex flex-col items-center justify-center w-16 text-saffron-text hover:text-saffron-strong transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">Back</span>
        </button>

        {/* BUTTON 2: HOME */}
        <Link 
          href={`/${currentLang}`}
          className="flex flex-col items-center justify-center w-16 -mt-6 bg-saffron-strong text-white rounded-full h-16 w-16 border-4 border-saffron-base shadow-lg hover:scale-105 transition-transform"
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
             <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
           </svg>
        </Link>

        {/* BUTTON 3: LANGUAGE SWITCHER */}
        <Link 
          href={switchUrl}
          className="flex flex-col items-center justify-center w-16 text-saffron-text hover:text-saffron-strong transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">{targetLabel}</span>
        </Link>

      </div>
    </div>
  );
}