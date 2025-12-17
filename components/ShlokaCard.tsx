"use client";

import React, { useState, useRef } from 'react';
import { useParams } from 'next/navigation';

interface ShlokaProps {
  sanskrit: string;
  en: string;
  hi: string;
  audioSrc?: string; // Expects a path like "/audio/filename.mp3"
}

export default function ShlokaCard({ sanskrit, en, hi, audioSrc }: ShlokaProps) {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  // Simple state for Play/Pause
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="my-10">
      
      {/* --- SANSKRIT SECTION --- */}
      <div className="bg-saffron-surface border-t-4 border-b-4 border-saffron-strong py-8 px-4 text-center rounded-lg shadow-sm mb-6 relative">
        <p className="font-sanskrit text-3xl md:text-4xl font-bold text-maroon-900 leading-relaxed drop-shadow-sm mb-6">
          {sanskrit}
        </p>

        {/* AUDIO BUTTON (Only renders if audioSrc is provided) */}
        {audioSrc && (
          <div className="flex justify-center">
            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 px-4 py-2 bg-saffron-strong text-white rounded-full 
                         hover:bg-maroon-900 hover:scale-105 transition-all duration-300 shadow-md group"
            >
              {isPlaying ? (
                /* Pause Icon */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                </svg>
              ) : (
                /* Play Icon */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              )}
              
              <span className="text-xs font-bold uppercase tracking-wider">
                {isPlaying ? "Pause Chant" : "Listen"}
              </span>
            </button>

            {/* Hidden Audio Element */}
            <audio 
              ref={audioRef} 
              src={audioSrc} 
              onEnded={() => setIsPlaying(false)} 
            />
          </div>
        )}
      </div>

      {/* --- ENGLISH TRANSLATION --- */}
      {lang === 'en' && (
        <div className="bg-white/60 p-6 rounded-lg border border-saffron-border/50 text-center">
          <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-saffron-strong mb-3">
            English Translation
          </h4>
          <p className="font-body text-saffron-text text-xl italic leading-relaxed">
            &ldquo;{en}&rdquo;
          </p>
        </div>
      )}

      {/* --- HINDI TRANSLATION --- */}
      {lang === 'hi' && (
        <div className="bg-white/60 p-6 rounded-lg border border-saffron-border/50 text-center">
          <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-saffron-strong mb-3">
            भावार्थ
          </h4>
          <p className="font-body text-saffron-text text-xl leading-relaxed">
            &ldquo;{hi}&rdquo;
          </p>
        </div>
      )}

    </div>
  );
}