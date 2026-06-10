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
    <header className="bg-[#F8F7F4] border-b border-[#E0DDD8] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left: branding + page title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="font-playfair font-bold text-lg text-[#0A0A0A] hover:opacity-70 transition-opacity"
        >
          NexusBrief
        </Link>
        <span className="text-[#8A8A8A] font-light select-none">&mdash;</span>
        <span className="font-montserrat text-[11px] uppercase tracking-[0.15em] text-[#8A8A8A]">
          {title}
        </span>
      </div>

      {/* Right: logout */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-[#8A8A8A] hover:text-[#0A0A0A]"
      >
        Logout
      </Button>
    </header>
  );
};

export default Topbar;
