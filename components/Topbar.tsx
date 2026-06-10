'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface TopbarProps {
  title: string;
  showSidebar?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  showSidebar = true,
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <header className="bg-[#F8F7F4] border-b border-ink/10 px-6 py-6 sticky top-0 z-40 relative">
      {/* Paper texture overlay for consistency */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.35] mix-blend-multiply z-0"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
      />
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center max-w-[1400px] mx-auto">
        {/* Top meta row */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex-1 hidden md:block">
            <span className="font-garamond italic text-[15px] text-ink/80">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <div className="flex-1 flex justify-start md:justify-center">
            <span className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-ink/60 font-semibold">
              {title}
            </span>
          </div>

          <div className="flex-1 flex justify-end">
            <button
              onClick={handleLogout}
              className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-ink/50 hover:text-ink transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Thick/thin newspaper rules */}
        <div className="w-full h-[3px] bg-ink/90 mb-[2px]" />
        <div className="w-full h-px bg-ink/50 mb-6" />

        {/* Centered Masthead */}
        <Link
          href="/dashboard"
          className="font-playfair font-black text-ink hover:text-ink/80 transition-colors tracking-tighter"
          style={{ fontSize: 'clamp(46px, 6vw, 72px)', lineHeight: '0.9' }}
        >
          NexusBrief
        </Link>
        
        {/* Sub-masthead dateline */}
        <div className="mt-5 flex items-center gap-4 w-full max-w-lg">
          <div className="h-px bg-ink/10 flex-1" />
          <span className="font-montserrat text-[8px] uppercase tracking-[0.4em] text-ink/40">
            LATE EDITION • VOL. I
          </span>
          <div className="h-px bg-ink/10 flex-1" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
