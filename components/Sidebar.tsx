'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Clock,
  Bookmark,
  Settings,
  User,
  LogOut,
} from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'History', href: '/dashboard/history', icon: Clock },
  { label: 'Bookmarks', href: '/dashboard/bookmarks', icon: Bookmark },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
];

interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <aside className="w-64 bg-[#FDFCFA] border-r border-ink/10 flex flex-col min-h-screen relative shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Decorative texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.3] mix-blend-multiply z-0"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Brand Header */}
        <div className="py-8 px-8 border-b border-ink/10 flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-ink text-white flex items-center justify-center font-playfair italic text-2xl mb-3 shadow-md">
            N
          </div>
          <h2 className="font-playfair font-black tracking-tight text-ink text-xl">
            NexusBrief
          </h2>
          <p className="font-montserrat text-[8px] uppercase tracking-[0.3em] text-ink/50 mt-1 font-bold">
            Daily Edition
          </p>
        </div>

        {/* Section label */}
        <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-ink/40 px-8 mb-4 font-bold select-none text-center">
          Index
        </p>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 px-4">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={[
                  'flex items-center gap-4 px-4 py-3 font-montserrat text-[11px] uppercase tracking-[0.1em] transition-all cursor-pointer group',
                  isActive
                    ? 'text-ink font-bold bg-ink/5'
                    : 'text-ink/60 hover:text-ink hover:bg-ink/5 font-semibold',
                ].join(' ')}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-ink" : "text-ink/50 group-hover:text-ink"} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="mt-auto px-4 pb-8">
          <div className="border-t border-ink/10 pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 font-montserrat text-[10px] uppercase tracking-[0.15em] font-bold text-ink/60 hover:text-ink border border-transparent hover:border-ink/20 hover:bg-ink/5 transition-all cursor-pointer"
            >
              <LogOut size={14} strokeWidth={2} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
