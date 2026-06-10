'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

// ─── Topbar ──────────────────────────────────────────────────────────────────
function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-4">
        <a
          href="/dashboard/settings"
          className="font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink-muted hover:text-ink transition-colors"
        >
          ← Settings
        </a>
        <span className="text-border">|</span>
        <span className="font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink">
          {title}
        </span>
      </div>
      <a
        href="/dashboard"
        className="font-playfair font-black text-[18px] text-ink tracking-tight"
      >
        NexusBrief
      </a>
    </header>
  );
}

// ─── Modes ────────────────────────────────────────────────────────────────────
const MODES = [
  {
    id:    'LATEST_FIRST',
    label: 'Latest First',
    desc:  'Newest articles sorted by publication date. See what just happened.',
  },
  {
    id:    'MOST_RELEVANT',
    label: 'Most Relevant',
    desc:  'Ranked by source feed position. Higher-ranked sources surface first.',
  },
  {
    id:    'MOST_POPULAR',
    label: 'Most Popular',
    desc:  'Longer summaries surface first — a proxy for depth and coverage.',
  },
] as const;

type ModeId = (typeof MODES)[number]['id'];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PrioritizationPage() {
  const supabase = createBrowserSupabaseClient();

  const [selectedMode, setSelectedMode] = useState<ModeId>('LATEST_FIRST');
  const [loading, setLoading]           = useState(true);
  const [saving,  setSaving]            = useState(false);
  const [message, setMessage]           = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Fetch current mode ─────────────────────────────────────────────────────
  const fetchMode = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: pref } = await supabase
        .from('digest_preferences')
        .select('prioritization_mode')
        .eq('user_id', user.id)
        .single();

      if (pref?.prioritization_mode) {
        setSelectedMode(pref.prioritization_mode as ModeId);
      }
    } catch (err) {
      console.error('Error fetching prioritization mode:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => { fetchMode(); }, [fetchMode]);

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('digest_preferences')
        .upsert(
          { user_id: user.id, prioritization_mode: selectedMode },
          { onConflict: 'user_id' }
        );
      if (error) throw error;

      setMessage({ type: 'success', text: 'Prioritization mode saved.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save mode.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Topbar title="Prioritization" />

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="font-playfair font-black text-[32px] text-ink leading-tight">
            Prioritization Mode
          </h1>
          <p className="font-garamond text-[15px] text-ink-muted mt-2">
            How your Top&nbsp;5 digest articles are selected and ranked.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {MODES.map((m) => (
              <div key={m.id} className="h-[120px] bg-surface animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {MODES.map((mode, idx) => {
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`w-full text-left border p-6 cursor-pointer transition-colors duration-150 flex items-center gap-6 ${
                    isSelected
                      ? 'border-ink bg-ink text-white'
                      : 'border-border bg-white hover:bg-surface text-ink'
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                  id={`mode-${mode.id}`}
                >
                  {/* Number */}
                  <span
                    className={`font-montserrat text-[11px] uppercase tracking-widest flex-shrink-0 ${
                      isSelected ? 'text-white/60' : 'text-ink-muted'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Label + description */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-playfair font-bold text-[20px] leading-tight ${
                        isSelected ? 'text-white' : 'text-ink'
                      }`}
                    >
                      {mode.label}
                    </p>
                    <p
                      className={`font-garamond text-[14px] mt-1 ${
                        isSelected ? 'text-white/80' : 'text-ink-muted'
                      }`}
                    >
                      {mode.desc}
                    </p>
                  </div>

                  {/* Radio circle */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      isSelected ? 'border-white' : 'border-border'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Success / error message */}
        {message && (
          <div
            className={`mt-6 px-5 py-4 border font-garamond text-[14px] ${
              message.type === 'success'
                ? 'border-success text-success bg-success/5'
                : 'border-danger text-danger bg-danger/5'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="mt-8 w-full bg-ink text-white font-montserrat text-[12px] uppercase tracking-[0.15em] py-4 border border-ink hover:bg-white hover:text-ink transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : 'Save Mode'}
        </button>
      </main>
    </div>
  );
}
