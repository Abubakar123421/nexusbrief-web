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

// ─── Types ────────────────────────────────────────────────────────────────────
interface Assignment {
  courseId:   string;
  courseName: string;
  title:      string;
  dueDate:    string | null;
  link:       string | null;
}

type DueStatus = 'overdue' | 'urgent' | 'normal' | 'none';

function getDueStatus(dueDate: string | null): DueStatus {
  if (!dueDate) return 'none';
  const due = new Date(dueDate);
  const now = new Date();
  if (due < now) return 'overdue';
  const diffMs = due.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays <= 2) return 'urgent';
  return 'normal';
}

function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return '';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dueDate));
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function AssignmentSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border border-border p-5 animate-pulse">
          <div className="h-3 w-24 bg-surface mb-3" />
          <div className="h-5 w-3/4 bg-surface mb-2" />
          <div className="h-4 w-40 bg-surface" />
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ClassroomPage() {
  const supabase = createBrowserSupabaseClient();

  const [isConnected,  setIsConnected]  = useState(false);
  const [assignments,  setAssignments]  = useState<Assignment[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  // ── Check connection & fetch assignments ───────────────────────────────────
  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/classroom/assignments');
      if (res.status === 401 || res.status === 403) {
        setIsConnected(false);
        setIsLoading(false);
        return;
      }
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Failed to fetch assignments');
      }
      const data = await res.json();
      setAssignments(data.assignments ?? []);
      setIsConnected(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  // ── Connect with Google ────────────────────────────────────────────────────
  const handleConnect = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: [
          'openid',
          'email',
          'profile',
          'https://www.googleapis.com/auth/classroom.courses.readonly',
          'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
        ].join(' '),
        redirectTo: `${window.location.origin}/dashboard/settings/classroom`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Topbar title="Classroom" />

      <main className="max-w-2xl mx-auto px-6 py-12">

        {/* ── NOT CONNECTED ── */}
        {!isConnected && !isLoading && (
          <>
            <div className="mb-8 border-b border-border pb-8">
              <h1 className="font-playfair font-black text-[32px] text-ink leading-tight">
                Google Classroom
              </h1>
            </div>

            <div className="border border-border p-8 flex flex-col items-center text-center">
              <span className="text-[64px] mb-6" role="img" aria-label="Classroom">
                📚
              </span>
              <h2 className="font-playfair font-black text-[28px] text-ink">
                Google Classroom
              </h2>
              <p className="font-garamond text-[16px] text-ink-muted mt-4 max-w-sm">
                Connect your Google account to view upcoming assignments.
              </p>

              {error && (
                <div className="mt-4 px-4 py-3 border border-danger text-danger bg-danger/5 font-garamond text-[13px] w-full text-left">
                  {error}
                </div>
              )}

              <button
                onClick={handleConnect}
                className="mt-8 bg-ink text-white font-montserrat text-[12px] uppercase tracking-[0.15em] px-8 py-4 border border-ink hover:bg-white hover:text-ink transition-all duration-200"
              >
                Connect with Google
              </button>

              <p className="font-montserrat text-[11px] text-ink-muted mt-4">
                Requires signing in with Google and granting Classroom access.
              </p>
            </div>
          </>
        )}

        {/* ── CONNECTED ── */}
        {isConnected && (
          <>
            <div className="mb-10 border-b border-border pb-8">
              <h1 className="font-playfair font-black text-[32px] text-ink leading-tight">
                Upcoming Assignments
              </h1>
            </div>

            {isLoading ? (
              <AssignmentSkeleton />
            ) : assignments.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-playfair italic text-[20px] text-ink-muted">
                  🎉 No upcoming assignments!
                </p>
              </div>
            ) : (
              <div>
                {assignments.map((a, idx) => {
                  const status = getDueStatus(a.dueDate);
                  return (
                    <div
                      key={`${a.courseId}-${idx}`}
                      className="border border-border p-5 mb-3 hover:bg-surface transition-colors"
                    >
                      {/* Course name */}
                      <p className="font-montserrat text-[9px] uppercase tracking-widest text-ink-muted">
                        {a.courseName}
                      </p>

                      {/* Title */}
                      <p className="font-playfair font-bold text-[18px] text-ink mt-1">
                        {a.title}
                      </p>

                      {/* Due date */}
                      {a.dueDate && (
                        <div className="mt-3">
                          {status === 'overdue' && (
                            <span className="inline-block bg-danger/10 text-danger border-l-4 border-danger pl-3 py-1 font-garamond text-[13px]">
                              ⚠️ OVERDUE: {formatDueDate(a.dueDate)}
                            </span>
                          )}
                          {status === 'urgent' && (
                            <span className="font-garamond text-[13px] text-danger">
                              🔴 Due: {formatDueDate(a.dueDate)}
                            </span>
                          )}
                          {status === 'normal' && (
                            <span className="font-garamond text-[13px] text-ink-muted">
                              📅 Due: {formatDueDate(a.dueDate)}
                            </span>
                          )}
                        </div>
                      )}

                      {!a.dueDate && (
                        <p className="font-garamond text-[13px] text-ink-muted mt-2 italic">
                          No due date
                        </p>
                      )}

                      {/* Link */}
                      {a.link && (
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 font-montserrat text-[11px] uppercase tracking-widest text-ink underline underline-offset-2 hover:text-ink-muted transition-colors"
                        >
                          Open in Classroom →
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Loading initial state */}
        {isLoading && !isConnected && (
          <AssignmentSkeleton />
        )}
      </main>
    </div>
  );
}
