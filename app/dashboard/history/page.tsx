'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import Topbar from '@/components/Topbar';

interface DigestItem {
  id: string;
  headline: string;
  item_rank: number;
}

interface Digest {
  id: string;
  created_at: string;
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
        .select('*, digest_items(id, headline, item_rank)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

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
          new Date(d.created_at).toLocaleDateString().toLowerCase().includes(q) ||
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
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      <Topbar title="Digest History" />
      <main className="flex-1 overflow-y-auto px-8 py-8 max-w-4xl mx-auto w-full">
        {/* Page Header */}
        <div className="mb-8">
          <p
            className="font-montserrat text-[10px] uppercase tracking-widest text-[#8A8A8A] mb-1"
          >
            DIGEST HISTORY
          </p>
          <h1
            className="font-playfair font-black text-[36px] text-[#0A0A0A] leading-tight"
          >
            Your Archive
          </h1>
          <p className="font-garamond text-[#8A8A8A] text-[16px] mt-1">
            Every digest generated for your account.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by date or status…"
            className="border border-[#E0DDD8] px-4 py-3 font-garamond text-[15px] text-[#0A0A0A] placeholder-[#8A8A8A] w-full max-w-md focus:border-[#0A0A0A] focus:outline-none transition-colors bg-transparent"
          />
        </div>

        {/* Content */}
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <p className="font-playfair italic text-[22px] text-[#8A8A8A] text-center">
              {digests.length === 0
                ? 'No digests yet. Generate your first one.'
                : 'No digests match your search.'}
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((digest) => {
              const items = [...(digest.digest_items ?? [])].sort(
                (a, b) => a.item_rank - b.item_rank
              );
              const visibleItems = items.slice(0, 3);
              const extraCount = items.length - 3;

              return (
                <div
                  key={digest.id}
                  className="border border-[#E0DDD8] p-6 mb-4 hover:bg-[#F8F7F4] transition-colors"
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h2 className="font-playfair font-bold text-[18px] text-[#0A0A0A]">
                      {formatDate(digest.created_at)}
                    </h2>
                    <div className="flex items-center gap-2">
                      {/* Status badge */}
                      <span
                        className="font-montserrat text-[9px] uppercase tracking-widest px-2 py-1 border border-[#E0DDD8] text-[#3D3D3D]"
                      >
                        {digest.status}
                      </span>
                      {/* Viewed / New badge */}
                      <span
                        className={`font-montserrat text-[9px] uppercase tracking-widest px-2 py-1 ${
                          digest.is_viewed
                            ? 'border border-[#E0DDD8] text-[#8A8A8A]'
                            : 'bg-[#0A0A0A] text-[#FFFFFF]'
                        }`}
                      >
                        {digest.is_viewed ? 'Viewed' : 'New'}
                      </span>
                      {/* Item count */}
                      <span className="font-montserrat text-[11px] text-[#8A8A8A] ml-2">
                        {items.length} {items.length === 1 ? 'story' : 'stories'}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div>
                    {visibleItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`font-garamond text-[14px] text-[#3D3D3D] ${
                          idx > 0 ? 'border-t border-[#E0DDD8]/60 pt-2 mt-2' : ''
                        }`}
                      >
                        #{item.item_rank} {item.headline}
                      </div>
                    ))}
                    {extraCount > 0 && (
                      <p className="font-garamond text-[13px] text-[#8A8A8A] mt-2 italic border-t border-[#E0DDD8]/60 pt-2">
                        + {extraCount} more {extraCount === 1 ? 'story' : 'stories'}
                      </p>
                    )}
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
