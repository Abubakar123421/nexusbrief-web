'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Topbar from '@/components/Topbar';

interface SettingCard {
  href: string;
  title: string;
  description: string;
}

const SETTINGS_CARDS: SettingCard[] = [
  {
    href: '/dashboard/settings/preferences',
    title: 'Digest Preferences',
    description: 'Choose news categories and set importance weights.',
  },
  {
    href: '/dashboard/settings/prioritization',
    title: 'Prioritization Mode',
    description: 'Control how your top 5 articles are ranked.',
  },

  {
    href: '/dashboard/settings/schedule',
    title: 'Delivery Schedule',
    description: 'Set when your digest is automatically generated.',
  },
  {
    href: '/dashboard/settings/classroom',
    title: 'Google Classroom',
    description: 'View upcoming assignments from your courses.',
  },
  {
    href: '/dashboard/profile',
    title: 'My Profile',
    description: 'Update your name, email, and password.',
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      <Topbar title="Settings" />
      <main className="flex-1 overflow-y-auto px-8 py-8 max-w-6xl mx-auto w-full">
        {/* Page Header */}
        <div className="mb-8">
          <p className="font-montserrat text-[10px] uppercase tracking-widest text-[#8A8A8A] mb-1">
            CONFIGURATION
          </p>
          <h1 className="font-playfair font-black text-[36px] text-[#0A0A0A] leading-tight">
            Settings
          </h1>
          <p className="font-garamond text-[#8A8A8A] text-[16px] mt-1">
            Customize your NexusBrief experience.
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {SETTINGS_CARDS.map((card) => (
            <Link key={card.href} href={card.href}>
              <div className="border border-[#E0DDD8] p-7 hover:bg-[#F8F7F4] transition-colors cursor-pointer group flex flex-col h-full min-h-[140px] relative">
                {/* Arrow icon — shown on hover */}
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight
                    size={18}
                    className="text-[#3D3D3D]"
                    strokeWidth={1.5}
                  />
                </div>

                <h2 className="font-playfair font-bold text-[19px] text-[#0A0A0A] pr-6 leading-snug">
                  {card.title}
                </h2>
                <p className="font-garamond text-[14px] text-[#8A8A8A] mt-2 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
