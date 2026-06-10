'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import Topbar from '@/components/Topbar';

interface DigestItem {
  id: string;
  article_title: string;
  rank_position: number;
}

interface Digest {
  id: string;
  generated_at: string;
  status: string;
  is_viewed: boolean;
  digest_items: DigestItem[];
}

function SkeletonCard() {
  return (
    <div className="border border-border p-6 mb-4 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-[#E0DDD8] rounded w-40" />
        <div className="flex gap-2">
          <div className="h-5 bg-[#E0DDD8] rounded w-20" />
          <div className="h-5 bg-[#E0DDD8] rounded w-12" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-[#E0DDD8] rounded w-full" />
        <div className="h-4 bg-[#E0DDD8] rounded w-5/6" />
        <div className="h-4 bg-[#E0DDD8] rounded w-4/6" />
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const supabase = createBrowserSupabaseClient();
  const [digests, setDigests] = useState<Digest[]>([]);
  const [filtered, setFiltered] = useState<Digest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchDigests() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('digests')
        .select('*, digest_items(id, article_title, rank_position)')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false });

      setDigests(data ?? []);
      setFiltered(data ?? []);
      setLoading(false);
    }
    fetchDigests();
  }, [supabase]);

  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(digests);
      return;
    }
    setFiltered(
      digests.filter(
        (d) =>
          new Date(d.generated_at).toLocaleDateString().toLowerCase().includes(q) ||
          d.status.toLowerCase().includes(q)
      )
    );
  }, [search, digests]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col">
      <Topbar title="Digest Archive" />
      <main className="flex-1 overflow-y-auto px-8 md:px-16 py-16 max-w-[1000px] mx-auto w-full relative">
        {/* Paper texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.3] mix-blend-multiply z-0"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
        />

        <div className="relative z-10">
          {/* Page Header */}
          <div className="mb-16 border-b-2 border-ink pb-8 text-center md:text-left">
            <p className="font-montserrat text-[11px] uppercase tracking-[0.25em] text-ink/50 mb-2 font-bold">
              Edition Index
            </p>
            <h1 className="font-playfair font-black text-5xl md:text-6xl text-ink leading-tight tracking-tight">
              The Archive
            </h1>
          </div>

          {/* Search */}
          <div className="mb-12">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search past editions by date..."
              className="border-b border-ink/30 px-2 py-4 font-garamond text-xl text-ink placeholder-ink/40 w-full focus:border-ink focus:outline-none transition-colors bg-transparent"
            />
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-8">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="font-playfair italic text-4xl text-ink/20 mb-4">N</span>
              <p className="font-playfair italic text-2xl text-ink/50">
                {digests.length === 0
                  ? 'The archive is currently empty.'
                  : 'No editions found for that search.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {filtered.map((digest) => {
                const items = [...(digest.digest_items ?? [])].sort(
                  (a, b) => a.rank_position - b.rank_position
                );
                const visibleItems = items.slice(0, 4);
                const extraCount = items.length - 4;

                return (
                  <div key={digest.id} className="group relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-ink/0 group-hover:bg-ink transition-colors" />
                    
                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                      {/* Left Meta */}
                      <div className="w-full md:w-48 shrink-0">
                        <h2 className="font-playfair font-black text-2xl text-ink leading-tight mb-2">
                          {formatDate(digest.generated_at)}
                        </h2>
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="font-montserrat text-[9px] uppercase tracking-widest px-2 py-1 border border-ink/20 text-ink font-semibold">
                            {digest.status}
                          </span>
                          {!digest.is_viewed && (
                            <span className="font-montserrat text-[9px] uppercase tracking-widest px-2 py-1 bg-ink text-white font-semibold">
                              Unread
                            </span>
                          )}
                        </div>
                        <p className="font-montserrat text-[10px] uppercase tracking-widest text-ink/50 mt-4 font-semibold">
                          {items.length} {items.length === 1 ? 'Story' : 'Stories'}
                        </p>
                      </div>

                      {/* Right Items */}
                      <div className="flex-1 space-y-4 pt-1">
                        {visibleItems.map((item) => (
                          <div key={item.id} className="group/item">
                            <h3 className="font-garamond text-xl text-ink leading-snug group-hover/item:text-ink/60 transition-colors">
                              <span className="font-montserrat text-[10px] uppercase font-bold tracking-widest text-ink/40 mr-3 align-middle">
                                No. {item.rank_position}
                              </span>
                              {item.article_title}
                            </h3>
                          </div>
                        ))}
                        {extraCount > 0 && (
                          <p className="font-montserrat text-[10px] uppercase tracking-widest text-ink/40 font-bold pt-2 border-t border-ink/10 mt-4">
                            + {extraCount} more featured {extraCount === 1 ? 'story' : 'stories'} inside
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
