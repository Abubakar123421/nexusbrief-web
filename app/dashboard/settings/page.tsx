'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Topbar from '@/components/Topbar';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

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
  const supabase = createBrowserSupabaseClient();
  const [config, setConfig] = useState({
    categories: 'Loading...',
    schedule: 'Loading...',
    priority: 'Loading...',
    services: 'Checking...',
    bookmarks: 'Loading...'
  });
  const [lastUpdated, setLastUpdated] = useState('Just now');

  useEffect(() => {
    async function fetchConfig() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let categoriesStr = 'None Selected';
      let scheduleStr = 'Not Set';
      let priorityStr = 'Balanced';

      const { data: pref } = await supabase
        .from('digest_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (pref) {
        const { data: cats } = await supabase
          .from('preference_categories')
          .select('category_name, weight')
          .eq('preference_id', pref.id);
        
        if (cats && cats.length > 0) {
          categoriesStr = cats.filter(c => c.weight > 0).map(c => c.category_name).join(', ') || 'None Selected';
        }

        const time = pref.delivery_time ? pref.delivery_time.slice(0, 5) : '07:00';
        scheduleStr = `Daily • ${time}`;

        const pMode = pref.prioritization_mode || 'LATEST_FIRST';
        if (pMode === 'LATEST_FIRST') priorityStr = 'Latest First';
        else if (pMode === 'MOST_RELEVANT') priorityStr = 'Most Relevant';
        else if (pMode === 'MOST_POPULAR') priorityStr = 'Most Popular';
        else priorityStr = pMode;
      }

      const { data: bData } = await supabase
        .from('digest_items')
        .select('id, digests!inner(user_id)')
        .eq('digests.user_id', user.id)
        .eq('is_bookmarked', true);
      
      const bookmarksStr = bData ? bData.length.toString() : '0';

      let servicesStr = 'None';
      try {
        const res = await fetch('/api/classroom/assignments');
        if (res.ok) {
          servicesStr = 'Google Classroom';
        }
      } catch (err) {}

      setConfig({
        categories: categoriesStr,
        schedule: scheduleStr,
        priority: priorityStr,
        services: servicesStr,
        bookmarks: bookmarksStr
      });
      
      setLastUpdated('Just now');
    }

    fetchConfig();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col relative">
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.015] z-0"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")', backgroundAttachment: 'fixed' }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Topbar title="Settings" />
        <main className="flex-1 overflow-y-auto px-8 py-12 max-w-6xl mx-auto w-full">
          <div className="mb-10">
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
            {SETTINGS_CARDS.map((card, idx) => {
              const indexNumber = String(idx + 1).padStart(2, '0');
              return (
                <Link key={card.href} href={card.href}>
                  <div className="bg-[#fcfcfb] border border-[#000000]/[0.08] p-8 transition-all duration-300 cursor-pointer group flex flex-col h-full min-h-[160px] relative shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_12px_40px_rgba(0,0,0,0.06)] hover:border-[#000000]/[0.15]">
                    <div className="absolute top-8 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight
                        size={18}
                        className="text-[#3D3D3D]"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="mb-5">
                      <span className="font-montserrat text-[11px] uppercase tracking-[0.25em] text-[#8A8A8A]/60 font-semibold group-hover:text-[#8A8A8A] transition-colors duration-300 block">
                        {indexNumber}
                      </span>
                      <div className="w-8 h-[1px] bg-[#000000]/[0.08] mt-2 group-hover:bg-[#000000]/[0.15] transition-colors duration-300" />
                    </div>

                    <h2 className="font-playfair font-bold text-[19px] text-[#0A0A0A] pr-6 leading-snug">
                      {card.title}
                    </h2>
                    <p className="font-garamond text-[15px] text-[#8A8A8A] mt-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 max-w-3xl mx-auto relative animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.02] z-0"
              style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
            />
            
            <div className="relative z-10 flex flex-col items-center text-center px-4 py-8">
              <div className="w-full h-[1px] bg-[#E0DDD8] mb-12 origin-center animate-in zoom-in-x duration-1000 delay-300" />
              
              <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-3 font-semibold">
                CONFIGURATION SUMMARY
              </p>
              <h2 className="font-playfair font-black text-[32px] md:text-[40px] text-[#0A0A0A] leading-tight mb-3">
                Today&apos;s Brief Configuration
              </h2>
              <p className="font-garamond text-[16px] text-[#8A8A8A] italic max-w-lg mb-12">
                Overview of your current NexusBrief personalization settings.
              </p>

              <div className="w-full max-w-xl text-left space-y-4">
                <div className="flex justify-between items-baseline border-b border-[#E0DDD8]/40 pb-3">
                  <span className="font-montserrat text-[11px] uppercase tracking-widest text-[#8A8A8A]">Categories</span>
                  <span className="font-garamond text-[17px] text-[#0A0A0A]">{config.categories}</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-[#E0DDD8]/40 pb-3">
                  <span className="font-montserrat text-[11px] uppercase tracking-widest text-[#8A8A8A]">Delivery Schedule</span>
                  <span className="font-garamond text-[17px] text-[#0A0A0A]">{config.schedule}</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-[#E0DDD8]/40 pb-3">
                  <span className="font-montserrat text-[11px] uppercase tracking-widest text-[#8A8A8A]">Priority Engine</span>
                  <span className="font-garamond text-[17px] text-[#0A0A0A]">{config.priority}</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-[#E0DDD8]/40 pb-3">
                  <span className="font-montserrat text-[11px] uppercase tracking-widest text-[#8A8A8A]">Connected Services</span>
                  <span className="font-garamond text-[17px] text-[#0A0A0A]">{config.services}</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-[#E0DDD8]/40 pb-3">
                  <span className="font-montserrat text-[11px] uppercase tracking-widest text-[#8A8A8A]">Bookmarks Saved</span>
                  <span className="font-garamond text-[17px] text-[#0A0A0A]">{config.bookmarks}</span>
                </div>
              </div>

              <p className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#8A8A8A] mt-12 font-medium">
                Last Updated &bull; {lastUpdated}
              </p>

              <div className="w-full h-[1px] bg-[#E0DDD8] mt-8 origin-center animate-in zoom-in-x duration-1000 delay-300" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
