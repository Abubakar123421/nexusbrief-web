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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-16">
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

        {/* Editorial Summary Panel */}
        <div className="mt-16 max-w-3xl mx-auto relative animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          {/* Subtle paper noise overlay */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.02] z-0"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
          />
          
          <div className="relative z-10 flex flex-col items-center text-center px-4 py-8">
            {/* Top Divider with outward animation */}
            <div className="w-full h-[1px] bg-[#E0DDD8] mb-12 origin-center animate-in zoom-in-x duration-1000 delay-300" />
            
            <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-3 font-semibold">
              CONFIGURATION SUMMARY
            </p>
            <h2 className="font-playfair font-black text-[32px] md:text-[40px] text-[#0A0A0A] leading-tight mb-3">
              Today's Brief Configuration
            </h2>
            <p className="font-garamond text-[16px] text-[#8A8A8A] italic max-w-lg mb-12">
              Overview of your current NexusBrief personalization settings.
            </p>

            {/* Content Table */}
            <div className="w-full max-w-xl text-left space-y-4">
              <div className="flex justify-between items-baseline border-b border-[#E0DDD8]/40 pb-3">
                <span className="font-montserrat text-[11px] uppercase tracking-widest text-[#8A8A8A]">Categories</span>
                <span className="font-garamond text-[17px] text-[#0A0A0A]">AI, Technology, Business</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E0DDD8]/40 pb-3">
                <span className="font-montserrat text-[11px] uppercase tracking-widest text-[#8A8A8A]">Delivery Schedule</span>
                <span className="font-garamond text-[17px] text-[#0A0A0A]">Daily &bull; 7:00 AM</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E0DDD8]/40 pb-3">
                <span className="font-montserrat text-[11px] uppercase tracking-widest text-[#8A8A8A]">Priority Engine</span>
                <span className="font-garamond text-[17px] text-[#0A0A0A]">Balanced</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E0DDD8]/40 pb-3">
                <span className="font-montserrat text-[11px] uppercase tracking-widest text-[#8A8A8A]">Connected Services</span>
                <span className="font-garamond text-[17px] text-[#0A0A0A]">Google Classroom</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#E0DDD8]/40 pb-3">
                <span className="font-montserrat text-[11px] uppercase tracking-widest text-[#8A8A8A]">Bookmarks Saved</span>
                <span className="font-garamond text-[17px] text-[#0A0A0A]">12</span>
              </div>
            </div>

            <p className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#8A8A8A] mt-12 font-medium">
              Last Updated &bull; 2 hours ago
            </p>

            {/* Bottom Divider */}
            <div className="w-full h-[1px] bg-[#E0DDD8] mt-8 origin-center animate-in zoom-in-x duration-1000 delay-300" />
          </div>
        </div>
      </main>
    </div>
  );
}
