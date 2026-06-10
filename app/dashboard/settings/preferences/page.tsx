'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

// ─── Topbar ──────────────────────────────────────────────────────────────────
function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-4">
        <a
          href="/dashboard"
          className="font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink-muted hover:text-ink transition-colors"
        >
          ← Dashboard
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

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'General',    desc: 'Top general news stories',          emoji: '📰', color: '#64748B' },
  { name: 'Technology', desc: 'Tech industry & gadgets',           emoji: '💻', color: '#0A0A0A' },
  { name: 'Sports',     desc: 'Sports news & match scores',        emoji: '⚽', color: '#0A0A0A' },
  { name: 'Business',   desc: 'Business & economy',                emoji: '💼', color: '#0A0A0A' },
  { name: 'Science',    desc: 'Science & research',                emoji: '🔬', color: '#0A0A0A' },
  { name: 'Stocks',     desc: 'Stock market & investments',        emoji: '📈', color: '#0A0A0A' },
  { name: 'Crypto',     desc: 'Cryptocurrency & blockchain',       emoji: '🪙', color: '#0A0A0A' },
  { name: 'Politics',   desc: 'Politics & government',             emoji: '🏛️', color: '#0A0A0A' },
];

interface CategoryState {
  enabled: boolean;
  weight: number; // 0 | 1 | 2
}

type CategoryMap = Record<string, CategoryState>;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PreferencesPage() {
  const supabase = createBrowserSupabaseClient();

  const [prefId, setPrefId] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryMap>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.name, { enabled: true, weight: 1 }]))
  );
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [message, setMessage]   = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Fetch existing preferences ─────────────────────────────────────────────
  const fetchPreferences = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get the digest_preferences row for this user
      const { data: pref } = await supabase
        .from('digest_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!pref) { setLoading(false); return; }
      setPrefId(pref.id);

      // Get preference_categories
      const { data: cats } = await supabase
        .from('preference_categories')
        .select('category_name, weight')
        .eq('preference_id', pref.id);

      if (cats && cats.length > 0) {
        const updated: CategoryMap = Object.fromEntries(
          CATEGORIES.map((c) => [c.name, { enabled: false, weight: 1 }])
        );
        cats.forEach((row: { category_name: string; weight: number }) => {
          if (updated[row.category_name] !== undefined) {
            updated[row.category_name] = {
              enabled: true,
              weight: row.weight ?? 1,
            };
          }
        });
        setCategories(updated);
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => { fetchPreferences(); }, [fetchPreferences]);

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let currentPrefId = prefId;

      // Ensure preference row exists
      if (!currentPrefId) {
        const { data: newPref, error } = await supabase
          .from('digest_preferences')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        if (error) throw error;
        currentPrefId = newPref.id;
        setPrefId(currentPrefId);
      }

      // Delete existing preference_categories for this preference_id
      const { error: delError } = await supabase
        .from('preference_categories')
        .delete()
        .eq('preference_id', currentPrefId);
      if (delError) throw delError;

      // Build insert payload for enabled categories
      const inserts = CATEGORIES
        .filter((c) => categories[c.name]?.enabled)
        .map((c) => ({
          preference_id:  currentPrefId,
          category_name:  c.name,
          weight:         categories[c.name]?.weight ?? 1,
        }));

      if (inserts.length > 0) {
        const { error: insError } = await supabase
          .from('preference_categories')
          .insert(inserts);
        if (insError) throw insError;
      }

      setMessage({ type: 'success', text: 'Preferences saved successfully.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save preferences.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle / Weight helpers ────────────────────────────────────────────────
  const toggleCategory = (name: string) => {
    setCategories((prev) => ({
      ...prev,
      [name]: { ...prev[name], enabled: !prev[name].enabled },
    }));
  };

  const setWeight = (name: string, weight: number) => {
    setCategories((prev) => ({
      ...prev,
      [name]: { ...prev[name], weight },
    }));
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Topbar title="Preferences" />

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="font-playfair font-black text-[32px] text-ink leading-tight">
            Digest Preferences
          </h1>
          <p className="font-garamond text-[15px] text-ink-muted mt-2">
            Set category weights (0&nbsp;=&nbsp;off, 1&nbsp;=&nbsp;normal, 2&nbsp;=&nbsp;high&nbsp;priority)
          </p>
        </div>

        {loading ? (
          /* Skeleton */
          <div className="space-y-4">
            {CATEGORIES.map((c) => (
              <div key={c.name} className="h-[72px] bg-surface animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="space-y-0 border border-border divide-y divide-border">
            {CATEGORIES.map((cat) => {
              const state = categories[cat.name];
              return (
                <div
                  key={cat.name}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                    state.enabled ? 'bg-white' : 'bg-surface'
                  }`}
                >
                  {/* Emoji badge */}
                  <div className="w-10 h-10 bg-surface border border-border flex items-center justify-center text-xl flex-shrink-0">
                    {cat.emoji}
                  </div>

                  {/* Name + desc */}
                  <div className="flex-1 min-w-0">
                    <p className="font-playfair font-bold text-[17px] text-ink leading-tight">
                      {cat.name}
                    </p>
                    <p className="font-garamond text-[13px] text-ink-muted mt-0.5">
                      {cat.desc}
                    </p>

                    {/* Weight slider — only visible when enabled */}
                    {state.enabled && (
                      <div className="flex items-center gap-3 mt-3">
                        <input
                          id={`weight-${cat.name}`}
                          type="range"
                          min={0}
                          max={2}
                          step={1}
                          value={state.weight}
                          onChange={(e) => setWeight(cat.name, Number(e.target.value))}
                          className="w-32 h-1 accent-[#0A0A0A] cursor-pointer"
                          style={{ accentColor: '#0A0A0A' }}
                          aria-label={`Weight for ${cat.name}`}
                        />
                        <span className="font-montserrat text-[11px] uppercase tracking-widest text-ink-muted w-6 text-center">
                          {state.weight === 0 ? 'Off' : state.weight === 1 ? '1×' : '2×'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => toggleCategory(cat.name)}
                    aria-label={`Toggle ${cat.name}`}
                    className={`w-12 h-6 flex-shrink-0 relative border transition-all duration-200 ${
                      state.enabled
                        ? 'bg-ink border-ink'
                        : 'bg-transparent border-border'
                    }`}
                    role="switch"
                    aria-checked={state.enabled}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white transition-all duration-200 ${
                        state.enabled ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
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

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="mt-8 w-full bg-ink text-white font-montserrat text-[12px] uppercase tracking-[0.15em] py-4 border border-ink hover:bg-white hover:text-ink transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : 'Save Preferences'}
        </button>
      </main>
    </div>
  );
}
