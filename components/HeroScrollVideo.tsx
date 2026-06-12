'use client';

import Link from 'next/link';

export default function HeroScrollVideo() {
  return (
    <div className="relative h-screen overflow-hidden bg-ink">
      {/* Video - Autoplaying smoothly instead of scroll-scrubbing */}
      <video
        src="/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        style={{ filter: 'grayscale(100%) contrast(1.15)' }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/50" />

      {/* Top nav bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-10 py-6 z-20">
        <span className="font-playfair text-white text-xl font-bold tracking-wide">
          NexusBrief
        </span>
        <div className="flex items-center gap-6">
          <Link
            href="/auth/login"
            className="font-montserrat text-white/80 text-[13px] uppercase tracking-[0.12em] hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="font-montserrat text-[12px] uppercase tracking-[0.12em] font-semibold border border-white text-white px-5 py-2.5 hover:bg-white hover:text-ink transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Hero content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 z-10">
        {/* Eyebrow */}
        <p className="font-montserrat text-[11px] uppercase tracking-[0.35em] text-white/60 mb-7 animate-fadeIn">
          Your Personalized News Digest
        </p>

        {/* Main headline */}
        <h1
          className="font-playfair font-black text-white text-center leading-[1.03] max-w-5xl animate-fadeInUp"
          style={{ fontSize: 'clamp(48px, 7.5vw, 92px)' }}
        >
          The World,
          <br />
          <em className="italic">Curated For You.</em>
        </h1>

        {/* Sub */}
        <p className="font-garamond text-[19px] text-white/75 mt-8 max-w-xl leading-relaxed animate-fadeInUp">
          Five essential stories every morning — filtered by your interests,
          ranked by what matters most.
        </p>

        {/* CTA */}
        <div className="flex items-center gap-4 mt-12 animate-fadeInUp">
          <Link
            href="/auth/register"
            className="font-montserrat text-[12px] uppercase tracking-[0.15em] font-semibold bg-white text-ink px-10 py-4 hover:bg-transparent hover:text-white border border-white transition-all duration-300"
          >
            Start Reading →
          </Link>
          <Link
            href="/auth/login"
            className="font-montserrat text-[12px] uppercase tracking-[0.15em] text-white/70 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-white/50">
          Scroll
        </p>
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/60 animate-scrollLine" />
        </div>
      </div>
    </div>
  );
}
