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
    <div
      className="animate-pulse"
      style={{
        border: '1px solid #E0DDD8',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        backgroundColor: '#F8F7F4',
      }}
    >
      <div
        style={{
          height: '12px',
          width: '80px',
          backgroundColor: '#E0DDD8',
          marginBottom: '0.75rem',
          borderRadius: '2px',
        }}
      />
      <div
        style={{
          height: '24px',
          width: '70%',
          backgroundColor: '#E0DDD8',
          marginBottom: '0.5rem',
          borderRadius: '2px',
        }}
      />
      <div
        style={{
          height: '14px',
          width: '90%',
          backgroundColor: '#E0DDD8',
          marginBottom: '0.375rem',
          borderRadius: '2px',
        }}
      />
      <div
        style={{
          height: '14px',
          width: '75%',
          backgroundColor: '#E0DDD8',
          borderRadius: '2px',
        }}
      />
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '5rem',
        paddingBottom: '5rem',
        textAlign: 'center',
      }}
    >
      {/* Decorative rule */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          width: '100%',
          maxWidth: '320px',
        }}
      >
        <div style={{ flex: 1, height: '1px', backgroundColor: '#E0DDD8' }} />
        <span
          className="font-montserrat uppercase"
          style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#8A8A8A' }}
        >
          ✦
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#E0DDD8' }} />
      </div>

      <p
        className="font-playfair italic"
        style={{ fontSize: '32px', color: '#3D3D3D', marginBottom: '0.75rem', lineHeight: 1.25 }}
      >
        No digest yet.
      </p>
      <p
        className="font-garamond"
        style={{ fontSize: '16px', color: '#8A8A8A', marginBottom: '2rem' }}
      >
        Generate your first personalized briefing.
      </p>
      <button
        id="dashboard-empty-generate-btn"
        onClick={onGenerate}
        disabled={isGenerating}
        className="font-montserrat uppercase font-semibold flex items-center gap-2 transition-colors"
        style={{
          backgroundColor: '#0A0A0A',
          color: '#FFF',
          fontSize: '12px',
          letterSpacing: '0.15em',
          padding: '0.875rem 2rem',
          border: 'none',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          opacity: isGenerating ? 0.7 : 1,
        }}
      >
        {isGenerating ? (
          <>
            <SpinnerIcon /> Generating…
          </>
        ) : (
          '⚡ Generate Digest'
        )}
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
      className="font-montserrat uppercase"
      style={{
        fontSize: '9px',
        letterSpacing: '0.15em',
        padding: '0.2rem 0.5rem',
        backgroundColor: isViewed ? '#E0DDD8' : '#0A0A0A',
        color: isViewed ? '#8A8A8A' : '#FFF',
      }}
    >
      {isViewed ? 'Viewed' : 'New'}
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
      <div
        style={{
          padding: '1.75rem 2rem',
          borderBottom: '1px solid #E0DDD8',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Welcome */}
          <div>
            <p
              className="font-montserrat uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.25em', color: '#8A8A8A' }}
            >
              Welcome back
            </p>
            <h1
              className="font-playfair font-black"
              style={{ fontSize: '32px', color: '#0A0A0A', marginTop: '0.25rem', lineHeight: 1.1 }}
            >
              {user?.name ?? 'Reader'}
            </h1>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Refresh */}
            <button
              id="dashboard-refresh-btn"
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh digest"
              className="font-montserrat uppercase transition-colors"
              style={{
                border: '1px solid #E0DDD8',
                backgroundColor: 'transparent',
                color: '#3D3D3D',
                fontSize: '11px',
                letterSpacing: '0.12em',
                padding: '0.625rem 1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {/* Refresh icon */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>

            {/* Generate */}
            <button
              id="dashboard-generate-btn"
              onClick={onGenerate}
              disabled={isGenerating}
              className="font-montserrat uppercase font-semibold flex items-center gap-2 transition-colors"
              style={{
                backgroundColor: '#0A0A0A',
                color: '#FFF',
                fontSize: '12px',
                letterSpacing: '0.15em',
                padding: '0.75rem 1.5rem',
                border: 'none',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating ? 0.75 : 1,
              }}
            >
              {isGenerating ? (
                <>
                  <SpinnerIcon /> Generating…
                </>
              ) : (
                '⚡ Generate Digest'
              )}
            </button>
          </div>
        </div>

        {/* Digest meta */}
        {digest && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              marginTop: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <span
              className="font-montserrat"
              style={{ fontSize: '11px', color: '#8A8A8A' }}
            >
              Generated:{' '}
              <span style={{ color: '#3D3D3D' }}>{formatDate(digest.generated_at)}</span>
            </span>
            <span
              className="font-montserrat"
              style={{ fontSize: '11px', color: '#8A8A8A' }}
            >
              Status:{' '}
              <span style={{ color: '#3D3D3D', textTransform: 'uppercase' }}>
                {digest.status}
              </span>
            </span>
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
      <div style={{ padding: '2rem' }}>
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
