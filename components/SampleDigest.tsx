'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORIES = [
  { 
    n: '#1', 
    t: 'Tech Giants Face Antitrust Scrutiny in Record Case', 
    c: 'Technology',
    bg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80' 
  },
  { 
    n: '#2', 
    t: 'Central Banks Signal Rate Cuts Before Year-End', 
    c: 'Finance',
    bg: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2000&q=80'
  },
  { 
    n: '#3', 
    t: 'Scientists Map Full Human Protein Atlas', 
    c: 'Science',
    bg: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=2000&q=80'
  },
  { 
    n: '#4', 
    t: 'Championship Final: Overtime Drama Decides Title', 
    c: 'Sports',
    bg: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=2000&q=80'
  },
  { 
    n: '#5', 
    t: 'Climate Accord Reaches Critical Milestone at Summit', 
    c: 'Politics',
    bg: 'https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?auto=format&fit=crop&w=2000&q=80'
  },
];

export default function SampleDigest() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="relative py-40 px-6 overflow-hidden min-h-[800px] flex flex-col justify-center border-t border-[#3D3D3D]">
      {/* Default dark background */}
      <div className="absolute inset-0 bg-[#0A0A0A] z-0" />

      {/* Dynamic Backgrounds */}
      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.div
            key={hoveredIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={STORIES[hoveredIdx].bg} 
              alt="Background" 
              className="w-full h-full object-cover filter grayscale mix-blend-luminosity"
            />
            {/* Vignette overlay so text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto">
        <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] mb-8 text-center">
          Sample Digest
        </p>
        <h2
          className="font-playfair font-black tracking-tight text-[#FFFFFF] text-center leading-tight mb-24 drop-shadow-xl"
          style={{ fontSize: 'clamp(38px, 5vw, 64px)' }}
        >
          Your morning, in <em className="font-poppins italic font-semibold tracking-normal px-1">five</em> stories.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border border-white/10 bg-[#0A0A0A]/50 backdrop-blur-md">
          {STORIES.map((story, i) => {
            const isHovered = hoveredIdx === i;
            const isDimmed = hoveredIdx !== null && !isHovered;

            return (
              <div
                key={story.n}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group relative p-8 cursor-crosshair transition-all duration-500 ${
                  i < 4 ? 'border-b md:border-b-0 md:border-r border-white/10' : ''
                }`}
              >
                {/* Hover highlight overlay */}
                <div 
                  className={`absolute inset-0 bg-white/5 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
                />

                {/* Content */}
                <div className={`relative z-10 transition-all duration-500 ${isDimmed ? 'opacity-30 translate-y-1' : 'opacity-100 translate-y-0'}`}>
                  <span className={`font-montserrat text-[10px] font-semibold uppercase tracking-[0.25em] block mb-5 transition-colors duration-300 ${isHovered ? 'text-[#FFFFFF]' : 'text-[#8A8A8A]'}`}>
                    {story.n} · {story.c}
                  </span>
                  <p className={`font-playfair text-[18px] leading-snug transition-colors duration-300 ${isHovered ? 'text-[#FFFFFF]' : 'text-[#E0DDD8]'}`}>
                    {story.t}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
