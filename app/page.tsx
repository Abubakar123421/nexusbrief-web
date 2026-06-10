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
      <section className="bg-surface py-32 px-6 border-t border-border">
        <div className="max-w-content mx-auto text-center">
          <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-ink-muted mb-6">
            Get Started
          </p>
          <h2
            className="font-playfair font-black text-ink leading-[1.05] max-w-3xl mx-auto"
            style={{ fontSize: 'clamp(38px, 5vw, 68px)' }}
          >
            Your digest,
            <br />
            <em className="italic">starts today.</em>
          </h2>
          <p className="font-garamond text-[18px] text-ink-secondary mt-6 mb-12 max-w-lg mx-auto leading-relaxed">
            Free to use. Takes 60 seconds to set up. Your first digest is waiting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="font-montserrat text-[12px] uppercase tracking-[0.15em] font-semibold bg-ink text-white px-12 py-5 hover:bg-transparent hover:text-ink border border-ink transition-all duration-200"
            >
              Create Free Account
            </Link>
            <Link
              href="/auth/login"
              className="font-montserrat text-[12px] uppercase tracking-[0.15em] text-ink-muted hover:text-ink transition-colors"
            >
              Already have an account →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-ink py-14 px-6 border-t border-white/10">
        <div className="max-w-content mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <span className="font-playfair text-white text-xl font-bold">NexusBrief</span>
            <p className="font-garamond text-white/40 text-[14px] mt-2 italic">
              Your Daily News Digest
            </p>
          </div>
          <div className="flex gap-10">
            <div>
              <p className="font-montserrat text-[9px] uppercase tracking-widest text-white/30 mb-3">
                Product
              </p>
              {['Features', 'Pricing', 'Changelog'].map((l) => (
                <p key={l} className="font-montserrat text-[13px] text-white/50 hover:text-white cursor-pointer transition-colors mb-1.5">
                  {l}
                </p>
              ))}
            </div>
            <div>
              <p className="font-montserrat text-[9px] uppercase tracking-widest text-white/30 mb-3">
                Account
              </p>
              {[['Sign In', '/auth/login'], ['Register', '/auth/register']].map(([l, h]) => (
                <Link key={l} href={h} className="block font-montserrat text-[13px] text-white/50 hover:text-white transition-colors mb-1.5">
                  {l}
                </Link>
              ))}
            </div>
          </div>
          <p className="font-montserrat text-[11px] text-white/25 mt-auto">
            © {new Date().getFullYear()} NexusBrief
          </p>
        </div>
      </footer>

    </main>
  );
}
