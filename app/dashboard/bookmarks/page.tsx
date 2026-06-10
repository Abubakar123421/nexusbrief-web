'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import Topbar from '@/components/Topbar';

interface BookmarkItem {
  id: string;
  headline: string;
  summary: string | null;
  source_url: string | null;
  thumbnail_url: string | null;
  read_later_event_date: string | null;
  bookmark_date: string | null;
  source_id: string | null;
  digests?: { user_id: string };
}

function buildGoogleCalendarUrl(
  title: string,
  date: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return d;
  })()
): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = new Date(date);
  end.setHours(end.getHours() + 1);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Read: ${title}`,
    dates: `${fmt(date)}/${fmt(end)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function BookmarksPage() {
  const supabase = createBrowserSupabaseClient();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBookmarks() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('digest_items')
      .select('*, digests!inner(user_id)')
      .eq('digests.user_id', user.id)
      .eq('is_bookmarked', true)
      .order('bookmark_date', { ascending: false });

    setBookmarks((data as BookmarkItem[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRemove(itemId: string) {
    await supabase
      .from('digest_items')
      .update({ is_bookmarked: false })
      .eq('id', itemId);
    fetchBookmarks();
  }

  function formatScheduledDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      <Topbar title="Bookmarks" />
      <main className="flex-1 overflow-y-auto px-8 py-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="mb-8">
          <p className="font-montserrat text-[10px] uppercase tracking-widest text-[#8A8A8A] mb-1">
            SAVED ARTICLES
          </p>
          <h1 className="font-playfair font-black text-[36px] text-[#0A0A0A] leading-tight">
            Saved for Later
          </h1>
          <p className="font-garamond text-[#8A8A8A] text-[16px] mt-1">
            Articles you&apos;ve bookmarked from your digests.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-[#E0DDD8] p-6 animate-pulse"
              >
                <div className="h-40 bg-[#E0DDD8] mb-4" />
                <div className="h-3 bg-[#E0DDD8] rounded w-1/3 mb-3" />
                <div className="h-5 bg-[#E0DDD8] rounded w-full mb-2" />
                <div className="h-5 bg-[#E0DDD8] rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="font-playfair italic text-[28px] text-[#8A8A8A] text-center">
              Nothing saved yet.
            </p>
            <p className="font-garamond text-[16px] text-[#8A8A8A] text-center">
              Bookmark articles from your digest to find them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {bookmarks.map((item) => {
              const calendarDate = (() => {
                const d = new Date();
                d.setDate(d.getDate() + 1);
                d.setHours(9, 0, 0, 0);
                return d;
              })();

              return (
                <div
                  key={item.id}
                  className="border border-[#E0DDD8] p-6 hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Thumbnail */}
                  {item.thumbnail_url && (
                    <div className="w-full h-40 overflow-hidden -mx-6 -mt-6 mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.thumbnail_url}
                        alt={item.headline}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Source label */}
                  <p className="font-montserrat text-[9px] uppercase tracking-widest text-[#8A8A8A] mt-4">
                    {item.source_id ?? 'Article'}
                  </p>

                  {/* Headline */}
                  <h2 className="font-playfair italic text-[19px] font-medium text-[#0A0A0A] mt-2 line-clamp-3 leading-snug flex-1">
                    {item.headline}
                  </h2>

                  {/* Scheduled date */}
                  {item.read_later_event_date && (
                    <p className="font-montserrat text-[11px] text-[#8A8A8A] mt-3">
                      📅 Scheduled: {formatScheduledDate(item.read_later_event_date)}
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E0DDD8]">
                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-montserrat text-[10px] uppercase tracking-widest px-3 py-2 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] transition-colors"
                      >
                        Read Article
                      </a>
                    )}
                    <a
                      href={buildGoogleCalendarUrl(item.headline, calendarDate)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-montserrat text-[10px] uppercase tracking-widest px-3 py-2 border border-[#E0DDD8] text-[#3D3D3D] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-colors"
                    >
                      Add to Calendar
                    </a>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="font-montserrat text-[10px] uppercase tracking-widest px-3 py-2 border border-[#E0DDD8] text-[#8A8A8A] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
