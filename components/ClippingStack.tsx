'use client';

import { motion } from 'framer-motion';

const CLIPPINGS = [
  {
    id: 1,
    category: 'Global Markets',
    date: 'Oct 24, 2026',
    headline: 'Central Banks Signal Coordinated Rate Shift Amid Uncertainty',
    excerpt: 'In an unprecedented move, major central banks have hinted at a unified approach to stabilizing market volatility across trading blocs...',
    rotate: -2.5,
    xOffset: -12,
    zIndex: 10,
  },
  {
    id: 2,
    category: 'Technology & Policy',
    date: 'Oct 23, 2026',
    headline: 'Tech Giants Face Landmark Antitrust Ruling in Brussels',
    excerpt: 'European regulators handed down a decisive ruling that may force a structural breakup of the largest global tech conglomerates...',
    rotate: 2,
    xOffset: 15,
    zIndex: 20,
  },
  {
    id: 3,
    category: 'Geopolitics',
    date: 'Oct 22, 2026',
    headline: 'Climate Summit Produces Binding Accord for G20 Nations',
    excerpt: 'After grueling overnight negotiations, world leaders emerged with a surprisingly robust agreement aimed at deep industrial emissions cuts...',
    rotate: -1.5,
    xOffset: -5,
    zIndex: 30,
  },
  {
    id: 4,
    category: 'Economics',
    date: 'Oct 21, 2026',
    headline: 'Supply Chains Brace for Structural Overhaul Through 2026',
    excerpt: 'Logistics hubs worldwide are preparing for massive disruptions as manufacturers permanently prioritize supply resilience over efficiency...',
    rotate: 3,
    xOffset: 18,
    zIndex: 40,
  }
];

export default function ClippingStack() {
  return (
    <div className="relative w-full py-4 flex flex-col items-center">
      {CLIPPINGS.map((clip, index) => {
        // Negative top margin to overlap previous cards deeply, creating a stack
        const marginTop = index === 0 ? '0px' : '-70px';
        
        return (
          <motion.div
            key={clip.id}
            initial={{ rotate: clip.rotate, x: clip.xOffset, y: 0 }}
            whileHover={{ 
              rotate: 0, 
              scale: 1.04, 
              zIndex: 50,
              y: -8,
              transition: { type: 'spring', stiffness: 350, damping: 25 }
            }}
            style={{ 
              zIndex: clip.zIndex,
              marginTop 
            }}
            className="group w-full max-w-[420px] bg-[#FDFCF9] border border-ink/20 p-6 sm:p-8 cursor-pointer shadow-[2px_4px_16px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] relative"
          >
            {/* Subtle paper texture overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.25] mix-blend-multiply"
              style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
            />

            <div className="relative z-10">
              {/* Meta header */}
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-ink/10">
                <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-ink/60 font-semibold">
                  {clip.category}
                </span>
                <span className="font-garamond italic text-[13px] text-ink/50">
                  {clip.date}
                </span>
              </div>
              
              {/* Headline */}
              <h3 className="font-playfair font-bold text-[20px] leading-snug text-ink mb-3 group-hover:text-ink/80 transition-colors">
                {clip.headline}
              </h3>
              
              {/* Excerpt */}
              <p className="font-garamond text-[16px] text-ink/70 leading-relaxed line-clamp-2">
                {clip.excerpt}
              </p>
              
              {/* Read more indicator (Reveals on hover) */}
              <div className="mt-5 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="h-px bg-ink/20 flex-1 mr-4" />
                <span className="font-montserrat text-[10px] uppercase tracking-widest text-ink font-medium">
                  Read Article
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
