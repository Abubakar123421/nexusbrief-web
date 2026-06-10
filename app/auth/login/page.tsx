'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import TypewriterText from '@/components/TypewriterText';
import { ArrowLeft } from 'lucide-react';

const STORY_TEASERS = [
  'Central Banks Signal Coordinated Rate Shift Amid Inflation Uncertainty',
  'Tech Giants Face Landmark Antitrust Ruling in Brussels',
  'Climate Summit Produces Binding Carbon Accord for G20 Nations',
  'Geopolitical Realignment Accelerates in South-East Asia',
  'Global Supply Chains Brace for Structural Overhaul Through 2026',
];

const LOGIN_QUOTES = [
  "“The news that matters, nothing that doesn't.”",
  "“Curated intelligence for the modern reader.”",
  "“Your daily briefing, beautifully delivered.”"
];

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTeaserIdx, setCurrentTeaserIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTeaserIdx((prev) => (prev + 1) % STORY_TEASERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
        scopes:
          'email profile https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly',
      },
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 min-h-screen flex-col justify-between p-12 relative overflow-hidden bg-[#0A0A0A]">
        {/* Video background */}
        <video 
          src="/login page.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale"
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full w-full">
          {/* Logo & Back Link */}
          <div className="flex flex-col gap-6 w-max">
            <Link 
              href="/" 
              className="flex items-center gap-2 font-montserrat text-white/50 hover:text-white transition-colors text-[11px] uppercase tracking-widest"
            >
              <ArrowLeft size={14} />
              Return Home
            </Link>
            <span
              className="font-playfair font-bold text-white"
              style={{ fontSize: '1.5rem' }}
            >
              NexusBrief
            </span>
          </div>

          {/* Editorial Quote */}
          <TypewriterText texts={LOGIN_QUOTES} />

          {/* Glowing Animated News Ticker */}
          <div className="h-24 relative flex items-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTeaserIdx}
                initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: 'blur(0px)', 
                  textShadow: '0 0 15px rgba(255,255,255,0.6)' 
                }}
                exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                transition={{ duration: 0.8 }}
                className="font-montserrat uppercase tracking-[0.15em] text-white/90 text-sm font-semibold backdrop-blur-md bg-white/5 border border-white/10 p-5 rounded-xl w-full"
              >
                <div className="text-[10px] text-white/50 mb-2 tracking-[0.3em]">BREAKING NOW</div>
                {STORY_TEASERS[currentTeaserIdx]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-center relative bg-[#F8F7F4] px-8 py-16 lg:px-16 lg:py-20 selection:bg-ink selection:text-white">
        
        {/* Subtle Paper Texture Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
        />

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[460px] mx-auto"
        >
          {/* Mobile logo & Top Rule */}
          <div className="md:hidden mb-12 text-center">
            <h2 className="font-playfair font-black text-2xl tracking-tight text-ink uppercase">
              NexusBrief
            </h2>
            <div className="w-full h-px bg-ink/20 mt-4 mb-1" />
            <div className="w-full h-0.5 bg-ink/40" />
          </div>

          <div className="hidden md:block mb-10">
            <div className="w-12 h-12 flex items-center justify-center border border-ink/20 rounded-full mb-6">
              <span className="font-playfair italic text-2xl text-ink">N</span>
            </div>
          </div>

          {/* Heading Section */}
          <div className="mb-10">
            <h1 className="font-playfair font-black text-[42px] leading-[1.1] text-ink tracking-tight mb-4">
              Welcome back <br /> to The Digest.
            </h1>
            <p className="font-garamond text-[18px] text-ink/70 leading-relaxed max-w-[90%]">
              Sign in to access your curated intelligence and personalized briefings.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} noValidate className="space-y-6">
            {/* Email */}
            <div className="relative group">
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                className="block w-full font-garamond text-[18px] bg-transparent border-0 border-b border-ink/20 py-2 text-ink outline-none transition-all focus:border-ink focus:ring-0 peer"
              />
              <label
                htmlFor="login-email"
                className="absolute left-0 font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink/50 transition-all duration-300 peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-ink peer-valid:-top-4 peer-valid:text-[9px]"
                style={{ top: email ? '-16px' : '8px', fontSize: email ? '9px' : '11px', color: email ? '#0A0A0A' : 'rgba(10,10,10,0.5)' }}
              >
                Email Address
              </label>
            </div>

            {/* Password */}
            <div className="relative group pt-3">
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                className="block w-full font-garamond text-[18px] bg-transparent border-0 border-b border-ink/20 py-2 text-ink outline-none transition-all focus:border-ink focus:ring-0 peer"
              />
              <label
                htmlFor="login-password"
                className="absolute left-0 font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink/50 transition-all duration-300 peer-focus:top-0 peer-focus:text-[9px] peer-focus:text-ink peer-valid:top-0 peer-valid:text-[9px]"
                style={{ top: password ? '0px' : '20px', fontSize: password ? '9px' : '11px', color: password ? '#0A0A0A' : 'rgba(10,10,10,0.5)' }}
              >
                Password
              </label>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="font-garamond italic text-[15px] text-[#8C1F1F] pt-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Sign In Button */}
            <div className="pt-6">
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full bg-ink text-white font-montserrat text-[11px] uppercase tracking-[0.2em] py-4 border border-ink transition-all duration-300 hover:bg-transparent hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-ink/10" />
            <span className="font-playfair italic text-[14px] text-ink/50">
              or
            </span>
            <div className="flex-1 h-px bg-ink/10" />
          </div>

          {/* Google Button */}
          <button
            id="login-google-btn"
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-transparent border border-ink/20 py-3.5 font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink transition-all duration-300 hover:border-ink hover:bg-ink/5"
          >
            Continue with Google
          </button>

          {/* Register Link */}
          <div className="mt-12 pt-8 border-t border-ink/10 text-center">
            <p className="font-garamond text-[17px] text-ink/60">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="text-ink hover:text-ink/70 underline underline-offset-4 decoration-1 decoration-ink/30 hover:decoration-ink transition-all"
              >
                Subscribe
              </Link>
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
