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
      <div
        className="w-full md:w-1/2 min-h-screen flex flex-col justify-center"
        style={{
          backgroundColor: '#FFF',
          paddingLeft: '3rem',
          paddingRight: '3rem',
          paddingTop: '5rem',
          paddingBottom: '5rem',
        }}
      >
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
          {/* Mobile logo */}
          <div className="md:hidden mb-8">
            <p
              className="font-playfair font-bold"
              style={{ fontSize: '1.25rem', color: '#0A0A0A' }}
            >
              NexusBrief
            </p>
            <hr style={{ borderColor: '#E0DDD8', marginTop: '1rem' }} />
          </div>

          {/* Heading */}
          <h1
            className="font-playfair font-black"
            style={{ fontSize: '36px', color: '#0A0A0A', lineHeight: 1.1 }}
          >
            Welcome back
          </h1>
          <p
            className="font-garamond"
            style={{
              fontSize: '16px',
              color: '#8A8A8A',
              marginTop: '0.5rem',
              marginBottom: '2.5rem',
            }}
          >
            Sign in to your account
          </p>

          {/* Form */}
          <form onSubmit={handleSignIn} noValidate>
            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="login-email"
                className="font-montserrat uppercase block"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  color: '#8A8A8A',
                  marginBottom: '0.375rem',
                }}
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="font-garamond w-full transition-colors"
                style={{
                  border: '1px solid #E0DDD8',
                  backgroundColor: '#FFF',
                  padding: '0.875rem 1rem',
                  fontSize: '15px',
                  color: '#0A0A0A',
                  outline: 'none',
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = '#0A0A0A')
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = '#E0DDD8')
                }
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '0.5rem' }}>
              <label
                htmlFor="login-password"
                className="font-montserrat uppercase block"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  color: '#8A8A8A',
                  marginBottom: '0.375rem',
                }}
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="font-garamond w-full transition-colors"
                style={{
                  border: '1px solid #E0DDD8',
                  backgroundColor: '#FFF',
                  padding: '0.875rem 1rem',
                  fontSize: '15px',
                  color: '#0A0A0A',
                  outline: 'none',
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = '#0A0A0A')
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = '#E0DDD8')
                }
              />
            </div>

            {/* Error */}
            {error && (
              <p
                className="font-montserrat"
                style={{
                  fontSize: '12px',
                  color: '#8C1F1F',
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                {error}
              </p>
            )}

            {/* Sign In Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="font-montserrat uppercase font-semibold w-full transition-colors"
              style={{
                backgroundColor: '#0A0A0A',
                color: '#FFF',
                fontSize: '12px',
                letterSpacing: '0.15em',
                padding: '1rem',
                marginTop: '0.5rem',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.75 : 1,
              }}
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              margin: '1.5rem 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E0DDD8' }} />
            <span
              className="font-montserrat uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#8A8A8A' }}
            >
              or
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E0DDD8' }} />
          </div>

          {/* Google Button */}
          <button
            id="login-google-btn"
            type="button"
            onClick={handleGoogleSignIn}
            className="font-montserrat uppercase w-full flex items-center justify-center gap-3 transition-colors"
            style={{
              border: '1px solid #E0DDD8',
              backgroundColor: 'transparent',
              color: '#0A0A0A',
              fontSize: '12px',
              letterSpacing: '0.12em',
              padding: '1rem',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#F8F7F4')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            {/* Google SVG */}
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Register Link */}
          <p
            className="font-garamond text-center"
            style={{ fontSize: '15px', color: '#8A8A8A', marginTop: '2rem' }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              style={{ color: '#0A0A0A', textDecoration: 'underline' }}
            >
              Create one →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
