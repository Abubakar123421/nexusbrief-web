'use client';

import { useEffect, useState, useCallback } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import ArticleCard from '@/components/ArticleCard';
import ClassroomWidget from '@/components/ClassroomWidget';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DigestItem {
  id: string;
  digest_id: string;
  article_url: string;
  article_title: string;
  article_source: string;
  article_summary: string;
  article_category: string;
  article_published_at: string | null;
  article_image_url: string | null;
  relevance_score: number | null;
  user_rating: 'THUMBS_UP' | 'THUMBS_DOWN' | null;
  is_bookmarked: boolean;
  bookmark_date: string | null;
  rank_position: number | null;
}

interface Digest {
  id: string;
  user_id: string;
  generated_at: string;
  status: string;
  is_viewed: boolean;
  digest_items: DigestItem[];
}

interface CurrentUser {
  id: string;
  email: string;
  name: string;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="border border-ink/10 p-8 mb-6 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
      <div className="h-3 w-20 bg-ink/10 mb-4 rounded-sm" />
      <div className="h-8 w-3/4 bg-ink/10 mb-4 rounded-sm" />
      <div className="h-4 w-11/12 bg-ink/5 mb-2 rounded-sm" />
      <div className="h-4 w-4/5 bg-ink/5 rounded-sm" />
    </div>
  );
}

function LoadingState() {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((n) => (
        <SkeletonCard key={n} />
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onGenerate, isGenerating }: { onGenerate: () => void; isGenerating: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center relative overflow-hidden bg-surface border border-ink/10 mx-auto max-w-3xl mt-12 px-6">
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.25] mix-blend-multiply z-0"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
      />
      
      {/* Decorative center icon or watermark */}
      <div className="relative z-10 w-16 h-16 border border-ink/20 rounded-full flex items-center justify-center mb-8 bg-white/50 backdrop-blur-sm">
        <span className="font-playfair italic text-3xl text-ink/40">N</span>
      </div>

      <p className="relative z-10 font-playfair font-black text-4xl text-ink tracking-tight mb-4">
        The press is waiting.
      </p>
      <p className="relative z-10 font-garamond text-[19px] text-ink/60 mb-10 max-w-md mx-auto leading-relaxed">
        Your personalized editorial briefing has not been generated yet. Instruct the newsroom to compile today's edition.
      </p>
      
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="relative z-10 font-montserrat uppercase font-semibold flex items-center gap-3 transition-all bg-ink text-white text-[11px] tracking-[0.2em] px-10 py-4 border border-ink hover:bg-[#1A1A1A] hover:-translate-y-1 hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed"
      >
        {isGenerating ? <><SpinnerIcon /> Typesetting Edition...</> : 'Instruct Newsroom'}
      </button>
    </div>
  );
}

// ─── Spinner icon ─────────────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function StatusBadge({ isViewed }: { isViewed: boolean }) {
  return (
    <span
      className={`font-montserrat text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 font-semibold ${
        isViewed 
          ? 'border border-ink/20 text-ink/50 bg-transparent' 
          : 'bg-ink text-white border border-ink'
      }`}
    >
      {isViewed ? 'Viewed' : 'New Edition'}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const supabase = createBrowserSupabaseClient();

  const [digest, setDigest] = useState<Digest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [classroomAssignments, setClassroomAssignments] = useState<any[]>([]);

  // ── Fetch latest digest ──────────────────────────────────────────────────
  const fetchDigest = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from('digests')
        .select('*, digest_items(*)')
        .eq('user_id', userId)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        setDigest(null);
        return;
      }

      // Sort items by rank_position ascending
      const sorted = {
        ...data,
        digest_items: [...(data.digest_items ?? [])].sort(
          (a: DigestItem, b: DigestItem) =>
            (a.rank_position ?? 999) - (b.rank_position ?? 999)
        ),
      } as Digest;

      setDigest(sorted);

      // Mark as viewed
      if (!sorted.is_viewed) {
        await supabase
          .from('digests')
          .update({ is_viewed: true })
          .eq('id', sorted.id);
      }
    },
    [supabase]
  );

  // ── Mount: get user, then digest ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function init() {
      setIsLoading(true);

      const {
        data: { user: sbUser },
      } = await supabase.auth.getUser();

      if (!sbUser || cancelled) {
        setIsLoading(false);
        return;
      }

      const currentUser: CurrentUser = {
        id: sbUser.id,
        email: sbUser.email ?? '',
        name:
          (sbUser.user_metadata?.full_name as string) ||
          (sbUser.user_metadata?.name as string) ||
          sbUser.email?.split('@')[0] ||
          'Reader',
      };

      if (!cancelled) setUser(currentUser);

      await fetchDigest(sbUser.id);

      if (!cancelled) setIsLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [supabase, fetchDigest]);

  // ── Generate digest ───────────────────────────────────────────────────────
  const onGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/digest/generate', { method: 'POST' });
      if (res.ok && user) {
        await fetchDigest(user.id);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Refresh ───────────────────────────────────────────────────────────────
  const onRefresh = async () => {
    if (!user) return;
    setIsLoading(true);
    await fetchDigest(user.id);
    setIsLoading(false);
  };

  // ── Feedback ──────────────────────────────────────────────────────────────
  const onLike = async (itemId: string) => {
    await fetch('/api/digest/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, rating: 'THUMBS_UP' }),
    });
    // Optimistic update
    setDigest((prev) =>
      prev
        ? {
            ...prev,
            digest_items: prev.digest_items.map((item) =>
              item.id === itemId ? { ...item, user_rating: 'THUMBS_UP' } : item
            ),
          }
        : prev
    );
  };

  const onDislike = async (itemId: string) => {
    await fetch('/api/digest/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, rating: 'THUMBS_DOWN' }),
    });
    // Optimistic update
    setDigest((prev) =>
      prev
        ? {
            ...prev,
            digest_items: prev.digest_items.map((item) =>
              item.id === itemId ? { ...item, user_rating: 'THUMBS_DOWN' } : item
            ),
          }
        : prev
    );
  };

  const onBookmark = async (itemId: string) => {
    await supabase
      .from('digest_items')
      .update({ is_bookmarked: true, bookmark_date: new Date().toISOString() })
      .eq('id', itemId);
    // Optimistic update
    setDigest((prev) =>
      prev
        ? {
            ...prev,
            digest_items: prev.digest_items.map((item) =>
              item.id === itemId ? { ...item, is_bookmarked: true } : item
            ),
          }
        : prev
    );
  };

  // ── Format date ───────────────────────────────────────────────────────────
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="flex-1 overflow-y-auto" style={{ minWidth: 0 }}>
      {/* ── Top section ──────────────────────────────────────────────────── */}
      <div className="px-8 md:px-16 py-12 border-b border-ink/10 relative overflow-hidden bg-[#F8F7F4]">
        {/* Paper texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.35] mix-blend-multiply z-0"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
        />
        
        {/* Banner Graphic */}
        <div className="w-full h-48 md:h-64 mb-12 relative border border-ink/20 overflow-hidden group">
          <img 
            src="/dashboard-banner.png" 
            alt="Editorial Engraving" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply grayscale group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-ink/5 mix-blend-overlay" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-[#F8F7F4]/90 backdrop-blur-sm px-10 py-4 border border-ink/20 shadow-sm">
              <span className="font-playfair italic text-ink text-2xl md:text-3xl tracking-tight">Today's Edition</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          {/* Welcome */}
          <div>
            <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-ink/50 mb-2 font-semibold">
              Personalized for
            </p>
            <h1 className="font-playfair font-black text-ink text-4xl md:text-5xl leading-[1.1] tracking-tight">
              {user?.name ?? 'Reader'}
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 items-center">
            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="group font-montserrat uppercase text-[10px] tracking-[0.2em] px-5 py-3.5 border border-ink/20 hover:border-ink/60 text-ink/70 hover:text-ink transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-transparent font-semibold"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-180 transition-transform duration-500">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>

            {/* Generate */}
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="font-montserrat uppercase font-semibold text-[11px] tracking-[0.2em] bg-ink text-white px-8 py-3.5 border border-ink hover:bg-transparent hover:text-ink transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <><SpinnerIcon /> Typesetting...</>
              ) : (
                'Publish Digest'
              )}
            </button>
          </div>
        </div>

        {/* Digest meta */}
        {digest && (
          <div className="relative z-10 mt-8 pt-6 border-t border-ink/10 flex flex-wrap items-center gap-6">
            <span className="font-montserrat text-[10px] uppercase tracking-[0.15em] text-ink/40 font-semibold">
              Generated <span className="text-ink ml-1">{formatDate(digest.generated_at)}</span>
            </span>
            <div className="w-1 h-1 bg-ink/20 rounded-full" />
            <span className="font-montserrat text-[10px] uppercase tracking-[0.15em] text-ink/40 font-semibold">
              Status <span className="text-ink ml-1 uppercase">{digest.status}</span>
            </span>
            <div className="w-1 h-1 bg-ink/20 rounded-full" />
            <StatusBadge isViewed={digest.is_viewed} />
          </div>
        )}
      </div>

      {/* ── Classroom widget ──────────────────────────────────────────────── */}
      {classroomAssignments.length > 0 && (
        <div
          style={{
            padding: '1.25rem 2rem',
            borderBottom: '1px solid #E0DDD8',
            backgroundColor: '#F8F7F4',
          }}
        >
          <ClassroomWidget assignments={classroomAssignments} />
        </div>
      )}

      {/* ── Articles ──────────────────────────────────────────────────────── */}
      <div className="px-8 md:px-16 py-12 max-w-[1200px] mx-auto bg-white min-h-screen">
        {isLoading && <LoadingState />}

        {!isLoading && (!digest || digest.digest_items.length === 0) && (
          <EmptyState onGenerate={onGenerate} isGenerating={isGenerating} />
        )}

        {!isLoading &&
          digest?.digest_items.map((item, i) => (
            <div key={item.id} style={{ marginBottom: '1.5rem' }}>
              <ArticleCard
                item={item}
                rank={i + 1}
                onLike={() => onLike(item.id)}
                onDislike={() => onDislike(item.id)}
                onBookmark={() => onBookmark(item.id)}
              />
            </div>
          ))}
      </div>
    </main>
  );
}
