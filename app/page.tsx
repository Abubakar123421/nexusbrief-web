import HeroScrollVideo from '@/components/HeroScrollVideo';
import HowItWorks from '@/components/HowItWorks';
import NewsTicker from '@/components/NewsTicker';
import SampleDigest from '@/components/SampleDigest';
import DataFlowVisualization from '@/components/DataFlowVisualization';
import ClippingStack from '@/components/ClippingStack';
import Link from 'next/link';

const FEATURES = [
  {
    number: '01',
    headline: 'Digest, not noise.',
    body: 'NexusBrief cuts through the flood of daily news to surface five stories that actually matter to you — nothing more, nothing less.',
  },
  {
    number: '02',
    headline: 'Your calendar, informed.',
    body: 'Schedule article reading times directly to Google Calendar or export as a standard .ics file. Never miss a story worth your time.',
  },
  {
    number: '03',
    headline: 'Classroom, connected.',
    body: 'Google Classroom assignments appear alongside your digest — upcoming deadlines, sorted by urgency, so nothing slips through.',
  },
  {
    number: '04',
    headline: 'Feedback that sticks.',
    body: 'Thumbs up or down on any article. NexusBrief adjusts future digests to match your evolving interests.',
  },
];

export default function LandingPage() {
  return (
    <main className="bg-background text-ink">

      {/* ── HERO (scroll-video) ────────────────────────────────── */}
      <HeroScrollVideo />

      {/* ── HOW IT WORKS & TICKER ──────────────────────────────── */}
      <HowItWorks />
      <NewsTicker />

      {/* ── FEATURE HIGHLIGHTS ────────────────────────────────── */}
      <section className="bg-background py-28 px-6 border-t border-border">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1.5fr] gap-12 lg:gap-16 items-start relative">
            {/* Left — editorial headline */}
            <div className="lg:sticky lg:top-24 z-10">
              <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-ink-muted mb-6">
                Why NexusBrief
              </p>
              <h2
                className="font-playfair font-black text-ink leading-[1.05]"
                style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}
              >
                Journalism
                <br />
                <em className="italic">worth your</em>
                <br />
                attention.
              </h2>
              <div className="w-12 h-px bg-ink mt-8 mb-8" />
              <p className="font-garamond text-[17px] text-ink-secondary leading-relaxed max-w-sm">
                The best writing in the world means nothing if it never reaches you.
                NexusBrief makes sure it does.
              </p>
              <Link
                href="/auth/register"
                className="inline-block mt-10 font-montserrat text-[12px] uppercase tracking-[0.15em] font-semibold border border-ink text-ink px-8 py-4 hover:bg-ink hover:text-white transition-all duration-200"
              >
                Start Free →
              </Link>
            </div>

            {/* Center — editorial data flow visualization */}
            <div className="hidden lg:block h-full">
              <DataFlowVisualization />
            </div>

            {/* Right — clipping stack */}
            <div className="relative z-10">
              <ClippingStack />
            </div>
          </div>
        </div>
      </section>

      {/* ── SAMPLE DIGEST PREVIEW ─────────────────────────────── */}
      <SampleDigest />

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="relative bg-[#F8F7F4] pt-32 pb-48 px-6 border-t border-border overflow-hidden">
        {/* Subtle Paper Texture Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.35] mix-blend-multiply z-0"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
        />
        
        {/* Gentle Ambient Lighting Gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent opacity-80 pointer-events-none blur-3xl z-0" />

        {/* Editorial Micro-elements */}
        <div className="absolute top-8 left-8 hidden md:flex flex-col gap-1 z-10">
          <div className="w-16 h-px bg-ink/20" />
          <span className="font-montserrat text-[8px] uppercase tracking-[0.3em] text-ink/40">Edition: {new Date().getFullYear()}</span>
        </div>
        <div className="absolute top-8 right-8 hidden md:block z-10">
          <div className="w-8 h-8 rounded-full border border-ink/10 flex items-center justify-center">
            <span className="font-playfair italic text-ink/40 text-[12px]">N</span>
          </div>
        </div>

        {/* Slow-moving newswire accent */}
        <div className="absolute left-0 w-full overflow-hidden top-24 opacity-40 z-0">
          <div className="flex w-[200%] animate-scrollHorizontal">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-ink/20 whitespace-nowrap px-8">
                • THE WORLD'S BEST JOURNALISM CURATED FOR YOU • INTELLECTUAL PURSUITS 
              </span>
            ))}
          </div>
        </div>

        <div className="relative max-w-content mx-auto text-center z-10">
          <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-ink/50 mb-6 font-semibold">
            Get Started
          </p>
          <h2
            className="font-playfair font-black text-ink leading-[1.05] max-w-3xl mx-auto drop-shadow-sm"
            style={{ fontSize: 'clamp(38px, 5vw, 68px)' }}
          >
            Your digest,
            <br />
            <em className="italic font-light text-ink/80">starts today.</em>
          </h2>
          <p className="font-garamond text-[19px] text-ink/60 mt-8 mb-12 max-w-md mx-auto leading-relaxed">
            Free to use. Takes 60 seconds to set up. Your first digest is waiting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/auth/register"
              className="group relative font-montserrat text-[11px] uppercase tracking-[0.2em] font-semibold bg-ink text-white px-12 py-5 border border-ink transition-all duration-500 hover:bg-[#1A1A1A] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10">Create Free Account</span>
            </Link>
            <Link
              href="/auth/login"
              className="group font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink/60 hover:text-ink transition-colors duration-300 flex items-center gap-2"
            >
              Already have an account 
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
        
        {/* Soft transition into footer */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[#050505] z-20 pointer-events-none" />
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="relative bg-[#050505] pt-12 pb-14 px-6 border-t border-white/5 overflow-hidden">
        {/* Footer Ambient Background details */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.04] via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-content mx-auto flex flex-col md:flex-row items-start justify-between gap-12 z-10">
          <div className="relative">
            <span className="font-playfair text-white/90 text-2xl font-bold tracking-tight">NexusBrief</span>
            <p className="font-garamond text-white/40 text-[16px] mt-2 italic">
              Your Daily News Digest.
            </p>
            <div className="w-12 h-px bg-white/10 mt-6" />
          </div>
          <div className="flex gap-16">
            <div>
              <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-white/30 mb-5 font-semibold">
                Product
              </p>
              {['Features', 'Pricing', 'Changelog'].map((l) => (
                <p key={l} className="font-garamond text-[15px] text-white/50 hover:text-white cursor-pointer transition-colors duration-300 mb-2.5">
                  {l}
                </p>
              ))}
            </div>
            <div>
              <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-white/30 mb-5 font-semibold">
                Account
              </p>
              {[['Sign In', '/auth/login'], ['Register', '/auth/register']].map(([l, h]) => (
                <Link key={l} href={h} className="block font-garamond text-[15px] text-white/50 hover:text-white transition-colors duration-300 mb-2.5">
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative max-w-content mx-auto mt-20 pt-8 border-t border-white/10 flex items-center justify-between z-10">
          <p className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-white/20">
            © {new Date().getFullYear()} NexusBrief
          </p>
          <div className="flex gap-4">
            {/* Tiny decoration dots */}
            <div className="w-[3px] h-[3px] rounded-full bg-white/20" />
            <div className="w-[3px] h-[3px] rounded-full bg-white/10" />
            <div className="w-[3px] h-[3px] rounded-full bg-white/5" />
          </div>
        </div>
      </footer>

    </main>
  );
}
