'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bookmark, Clock, User, Settings } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'History', href: '/dashboard/history', icon: Clock },
    { label: 'Saved', href: '/dashboard/bookmarks', icon: Bookmark },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FDFCFA] border-t border-ink/10 flex items-center justify-around z-50 h-16">
      {/* Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.3] mix-blend-multiply z-0"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
      />
      
      <div className="relative z-10 flex w-full justify-around items-center px-2 h-full">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);
          
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 w-full h-full"
            >
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 1.5} 
                className={isActive ? "text-ink" : "text-ink/50"} 
              />
              <span className={`text-[9px] font-montserrat uppercase tracking-wider ${isActive ? 'text-ink font-bold' : 'text-ink/50 font-medium'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
