"use client";

import React from 'react';
import { motion } from "framer-motion";
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="my-10"
    >

      {/* --- SANSKRIT SECTION --- */}
      <div className="bg-saffron-surface border-t-4 border-b-4 border-saffron-strong py-8 px-4 text-center rounded-lg shadow-sm mb-6 relative">
        <p className="font-sanskrit text-3xl md:text-4xl font-bold text-maroon-900 leading-relaxed drop-shadow-sm mb-6">
          {sanskrit}
        </p>

        {/* AUDIO BUTTON (Only renders if audioSrc is provided) */}
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

    </motion.div>
  );
}