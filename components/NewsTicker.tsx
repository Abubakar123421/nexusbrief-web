'use client';

const SOURCES = [
  { name: 'The New York Times', domain: 'nytimes.com' },
  { name: 'Wall Street Journal', domain: 'wsj.com' },
  { name: 'Reuters', domain: 'reuters.com' },
  { name: 'Associated Press', domain: 'apnews.com' },
  { name: 'Bloomberg', domain: 'bloomberg.com' },
  { name: 'The Washington Post', domain: 'washingtonpost.com' },
  { name: 'Financial Times', domain: 'ft.com' },
  { name: 'BBC News', domain: 'bbc.co.uk' },
  { name: 'TechCrunch', domain: 'techcrunch.com' },
  { name: 'The Guardian', domain: 'theguardian.com' },
  { name: 'NPR', domain: 'npr.org' },
  { name: 'The Economist', domain: 'economist.com' },
];

export default function NewsTicker() {
  return (
    <section className="bg-[#0A0A0A] border-y border-white/10 py-5 overflow-hidden flex items-center ticker-container">
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker 35s linear infinite;
          width: max-content;
        }
        .ticker-container:hover .ticker-track {
          animation-play-state: paused;
        }
      `}</style>
      <div className="flex whitespace-nowrap overflow-hidden relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
        
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-12 items-center pl-12 ticker-track">
          {/* We duplicate the array to create a seamless infinite loop */}
          {[...SOURCES, ...SOURCES].map((source, i) => (
            <div key={i} className="flex items-center gap-12">
              <div className="flex items-center gap-4 group/item hover:scale-[1.15] transition-transform duration-300 ease-out cursor-default">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=64`}
                  alt={`${source.name} logo`}
                  className="w-6 h-6 object-contain opacity-50 group-hover/item:opacity-100 transition-all duration-300 grayscale group-hover/item:grayscale-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="font-playfair text-[20px] italic text-white/50 tracking-wide group-hover/item:text-white transition-colors">
                  {source.name}
                </span>
              </div>
              {/* Separator dot */}
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
