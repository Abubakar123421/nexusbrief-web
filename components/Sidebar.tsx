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
    <aside className="w-56 bg-[#F8F7F4] border-r border-[#E0DDD8] flex flex-col py-6 px-3 min-h-screen">
      {/* Section label */}
      <p className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#8A8A8A] px-3 mb-3 select-none">
        Menu
      </p>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2.5 font-montserrat text-[13px] transition-colors cursor-pointer',
                isActive
                  ? 'text-[#0A0A0A] bg-[#ECEAE5] font-medium border-l-2 border-[#0A0A0A]'
                  : 'text-[#8A8A8A] hover:text-[#0A0A0A] hover:bg-[#ECEAE5]',
              ].join(' ')}
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout at bottom */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 font-montserrat text-[13px] text-[#8C1F1F] hover:text-[#8C1F1F] hover:bg-[#F5EDED] transition-colors cursor-pointer"
        >
          <LogOut size={16} strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
