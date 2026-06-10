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

// ─── Interval options ─────────────────────────────────────────────────────────
const INTERVALS: { label: string; hours: number }[] = [
  { label: '1 Hour',   hours: 1  },
  { label: '6 Hours',  hours: 6  },
  { label: '12 Hours', hours: 12 },
  { label: '24 Hours', hours: 24 },
];

interface ScheduleRow {
  id:               string;
  user_id:          string;
  delivery_time:    string; // "HH:MM"
  interval_hours:   number;
  next_trigger_at:  string | null;
  is_active:        boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatDatetime(isoStr: string | null): string {
  if (!isoStr) return '—';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoStr));
}

function calcNextTrigger(timeValue: string): Date {
  const [h, m] = timeValue.split(':').map(Number);
  const now    = new Date();
  const candidate = new Date(now);
  candidate.setHours(h, m, 0, 0);
  if (candidate <= now) {
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const supabase = createBrowserSupabaseClient();

  const [schedule,         setSchedule]         = useState<ScheduleRow | null>(null);
  const [loading,          setLoading]           = useState(true);
  const [saving,           setSaving]            = useState(false);
  const [message,          setMessage]           = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedTime,     setSelectedTime]      = useState('08:00');
  const [selectedInterval, setSelectedInterval]  = useState(24);

  // ── Fetch schedule ─────────────────────────────────────────────────────────
  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('digest_schedules')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setSchedule(data as ScheduleRow);
        setSelectedTime(data.delivery_time ?? '08:00');
        setSelectedInterval(data.interval_hours ?? 24);
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => { fetchSchedule(); }, [fetchSchedule]);

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const nextTriggerAt = calcNextTrigger(selectedTime);

      const payload = {
        user_id:         user.id,
        delivery_time:   selectedTime,
        interval_hours:  selectedInterval,
        next_trigger_at: nextTriggerAt.toISOString(),
        is_active:       true,
      };

      const { error } = await supabase
        .from('digest_schedules')
        .upsert(payload, { onConflict: 'user_id' });
      if (error) throw error;

      // Refresh display
      setSchedule({ ...payload, id: schedule?.id ?? '', is_active: true });
      setMessage({ type: 'success', text: 'Schedule saved successfully.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save schedule.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Topbar title="Schedule" />

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="font-playfair font-black text-[32px] text-ink leading-tight">
            Delivery Schedule
          </h1>
          <p className="font-garamond text-[15px] text-ink-muted mt-2">
            Set when NexusBrief generates your digest automatically.
          </p>
        </div>

        {/* Current Schedule */}
        <section className="mb-10">
          <h2 className="font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink-muted mb-4">
            Current Schedule
          </h2>

          {loading ? (
            <div className="h-[100px] bg-surface animate-pulse border border-border" />
          ) : schedule ? (
            <div className="border border-border bg-surface p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-montserrat text-[11px] uppercase tracking-widest text-ink-muted">
                  Delivery Time
                </span>
                <span className="font-playfair font-bold text-[18px] text-ink">
                  {formatTime(schedule.delivery_time)}
                </span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between">
                <span className="font-montserrat text-[11px] uppercase tracking-widest text-ink-muted">
                  Repeat Every
                </span>
                <span className="font-garamond text-[15px] text-ink">
                  {schedule.interval_hours} hour{schedule.interval_hours !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between">
                <span className="font-montserrat text-[11px] uppercase tracking-widest text-ink-muted">
                  Next Digest
                </span>
                <span className="font-garamond text-[15px] text-ink">
                  {formatDatetime(schedule.next_trigger_at)}
                </span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between">
                <span className="font-montserrat text-[11px] uppercase tracking-widest text-ink-muted">
                  Status
                </span>
                <span
                  className={`font-montserrat text-[10px] uppercase tracking-widest px-3 py-1 border ${
                    schedule.is_active
                      ? 'bg-ink text-white border-ink'
                      : 'bg-surface text-ink-muted border-border'
                  }`}
                >
                  {schedule.is_active ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>
          ) : (
            <div className="border border-border p-6 text-center">
              <p className="font-garamond text-[15px] text-ink-muted italic">
                No schedule configured yet.
              </p>
            </div>
          )}
        </section>

        {/* Update Schedule */}
        <section>
          <h2 className="font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink-muted mb-4">
            Update Schedule
          </h2>

          {/* Time input */}
          <div className="mb-6">
            <label
              htmlFor="schedule-time"
              className="block font-montserrat text-[11px] uppercase tracking-widest text-ink-muted mb-2"
            >
              Delivery Time
            </label>
            <input
              id="schedule-time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border border-border px-4 py-3 font-garamond text-[15px] text-ink focus:border-ink focus:outline-none bg-white w-full sm:w-auto transition-colors"
            />
          </div>

          {/* Interval cards */}
          <div className="mb-2">
            <label className="block font-montserrat text-[11px] uppercase tracking-widest text-ink-muted mb-3">
              Repeat Interval
            </label>
            <div className="grid grid-cols-4 gap-2">
              {INTERVALS.map((interval) => {
                const isSelected = selectedInterval === interval.hours;
                return (
                  <button
                    key={interval.hours}
                    onClick={() => setSelectedInterval(interval.hours)}
                    className={`border py-4 px-2 text-center transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-ink text-white border-ink'
                        : 'border-border bg-white text-ink hover:bg-surface'
                    }`}
                    id={`interval-${interval.hours}`}
                  >
                    <span className="font-montserrat text-[11px] uppercase tracking-widest block">
                      {interval.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Success / error */}
        {message && (
          <div
            className={`mt-8 px-5 py-4 border font-garamond text-[14px] ${
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
          disabled={saving}
          className="mt-6 w-full bg-ink text-white font-montserrat text-[12px] uppercase tracking-[0.15em] py-4 border border-ink hover:bg-white hover:text-ink transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : 'Save Schedule'}
        </button>
      </main>
    </div>
  );
}
