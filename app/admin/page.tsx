'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Profile {
  id:         string;
  full_name:  string | null;
  email:      string | null;
  is_admin:   boolean;
  created_at: string;
}

interface DigestRow {
  id:         string;
  user_id:    string;
  created_at: string;
  status:     string | null;
  item_count: number | null;
  viewed:     boolean | null;
  profiles:   { full_name: string | null; email: string | null } | null;
}

interface ScheduleRow {
  id:              string;
  user_id:         string;
  delivery_time:   string;
  interval_hours:  number;
  next_trigger_at: string | null;
  is_active:       boolean;
  profiles:        { full_name: string | null; email: string | null } | null;
}

type AdminTab = 'users' | 'digests' | 'control';

// ─── Admin Topbar ─────────────────────────────────────────────────────────────
function AdminTopbar({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-ink text-white border-b border-border-strong flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-4">
        <span className="font-playfair font-black text-[20px] text-white tracking-tight">
          NexusBrief
        </span>
        <span className="bg-white text-ink font-montserrat text-[9px] uppercase tracking-widest px-3 py-0.5">
          ADMIN
        </span>
      </div>
      <button
        onClick={onLogout}
        className="font-montserrat text-[11px] uppercase tracking-[0.15em] text-white/70 hover:text-white transition-colors"
      >
        Logout
      </button>
    </header>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string | null }) {
  const s = (status ?? 'unknown').toLowerCase();
  const styles: Record<string, string> = {
    complete:   'bg-success/10 text-success border-success/30',
    completed:  'bg-success/10 text-success border-success/30',
    pending:    'bg-highlight text-ink-secondary border-border',
    generating: 'bg-highlight text-ink-secondary border-border',
    error:      'bg-danger/10 text-danger border-danger/30',
    failed:     'bg-danger/10 text-danger border-danger/30',
  };
  const cls = styles[s] ?? 'bg-surface text-ink-muted border-border';
  return (
    <span className={`font-montserrat text-[9px] uppercase tracking-widest px-2 py-0.5 border inline-block ${cls}`}>
      {status ?? 'Unknown'}
    </span>
  );
}

// ─── Confirmation modal ───────────────────────────────────────────────────────
function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel:  () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50">
      <div className="bg-white border border-border p-8 max-w-sm w-full mx-4 shadow-xl">
        <p className="font-garamond text-[16px] text-ink mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-danger text-white font-montserrat text-[11px] uppercase tracking-widest py-3 hover:opacity-80 transition-opacity"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-border text-ink font-montserrat text-[11px] uppercase tracking-widest py-3 hover:bg-surface transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-4 border font-garamond text-[14px] shadow-lg max-w-sm ${
        type === 'success'
          ? 'bg-white border-success text-success'
          : 'bg-white border-danger text-danger'
      }`}
    >
      {message}
    </div>
  );
}

// ─── Table header cell ────────────────────────────────────────────────────────
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="bg-ink text-white font-montserrat text-[10px] uppercase tracking-widest px-5 py-3 text-left whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-5 py-4 border-b border-border font-garamond text-[14px] text-ink ${className}`}>
      {children}
    </td>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router  = useRouter();
  const supabase = createBrowserSupabaseClient();

  const [activeTab,      setActiveTab]      = useState<AdminTab>('users');
  const [authChecked,    setAuthChecked]    = useState(false);
  const [toast,          setToast]          = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [confirmModal,   setConfirmModal]   = useState<{ message: string; onConfirm: () => void } | null>(null);

  // Users tab state
  const [profiles,       setProfiles]       = useState<Profile[]>([]);
  const [profilesLoading,setProfilesLoading]= useState(false);

  // Digests tab state
  const [digests,        setDigests]        = useState<DigestRow[]>([]);
  const [digestsLoading, setDigestsLoading] = useState(false);

  // Control tab state
  const [schedules,      setSchedules]      = useState<ScheduleRow[]>([]);
  const [schedulesLoading,setSchedulesLoading] = useState(false);
  const [controlUserId,  setControlUserId]  = useState('');
  const [generating,     setGenerating]     = useState(false);

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/dashboard'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin) {
        router.replace('/dashboard');
        return;
      }
      setAuthChecked(true);
    })();
  }, [supabase, router]);

  // ── Toast helper ───────────────────────────────────────────────────────────
  const showToast = (text: string, type: 'success' | 'error') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  // ── Fetch: Users ───────────────────────────────────────────────────────────
  const fetchProfiles = useCallback(async () => {
    setProfilesLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, is_admin, created_at')
        .eq('is_admin', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProfiles((data ?? []) as Profile[]);
    } catch (err) {
      console.error(err);
    } finally {
      setProfilesLoading(false);
    }
  }, [supabase]);

  // ── Fetch: Digests ─────────────────────────────────────────────────────────
  const fetchDigests = useCallback(async () => {
    setDigestsLoading(true);
    try {
      const { data, error } = await supabase
        .from('digests')
        .select('id, user_id, created_at, status, item_count, viewed, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setDigests((data ?? []) as unknown as DigestRow[]);
    } catch (err) {
      console.error(err);
    } finally {
      setDigestsLoading(false);
    }
  }, [supabase]);

  // ── Fetch: Schedules ───────────────────────────────────────────────────────
  const fetchSchedules = useCallback(async () => {
    setSchedulesLoading(true);
    try {
      const { data, error } = await supabase
        .from('digest_schedules')
        .select('id, user_id, delivery_time, interval_hours, next_trigger_at, is_active, profiles(full_name, email)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSchedules((data ?? []) as unknown as ScheduleRow[]);
    } catch (err) {
      console.error(err);
    } finally {
      setSchedulesLoading(false);
    }
  }, [supabase]);

  // ── Tab switch fetching ────────────────────────────────────────────────────
  useEffect(() => {
    if (!authChecked) return;
    if (activeTab === 'users')   fetchProfiles();
    if (activeTab === 'digests') fetchDigests();
    if (activeTab === 'control') { fetchSchedules(); fetchProfiles(); }
  }, [activeTab, authChecked, fetchProfiles, fetchDigests, fetchSchedules]);

  // ── Generate digest for user ───────────────────────────────────────────────
  const generateDigest = async (userId: string) => {
    try {
      const res = await fetch(`/api/digest/generate?userId=${userId}`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Failed to generate digest');
      }
      showToast('Digest generation started.', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error', 'error');
    }
  };

  // ── Delete user profile ────────────────────────────────────────────────────
  const deleteProfile = async (userId: string) => {
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      setProfiles((prev) => prev.filter((p) => p.id !== userId));
      showToast('User deleted.', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error', 'error');
    }
  };

  // ── Loading until auth check ───────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="font-garamond text-[16px] text-ink-muted italic animate-pulse">
          Verifying access…
        </p>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'users',   label: 'Users'         },
    { id: 'digests', label: 'All Digests'   },
    { id: 'control', label: 'Digest Control' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <AdminTopbar onLogout={handleLogout} />

      {/* Tab bar */}
      <div className="border-b border-border bg-white sticky top-[65px] z-30">
        <div className="max-w-content mx-auto px-8 flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              id={`admin-tab-${tab.id}`}
              className={`font-montserrat text-[12px] uppercase tracking-[0.15em] px-6 py-4 border-b-2 cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-content mx-auto px-8 py-10">

        {/* ─── USERS TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'users' && (
          <section>
            <h1 className="font-playfair font-black text-[28px] text-ink mb-6">
              Users
            </h1>

            {profilesLoading ? (
              <div className="space-y-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="h-14 bg-surface animate-pulse border border-border" />
                ))}
              </div>
            ) : (
              <div className="border border-border overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Joined</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center font-garamond text-[15px] text-ink-muted italic">
                          No users found.
                        </td>
                      </tr>
                    ) : profiles.map((profile) => (
                      <tr key={profile.id} className="hover:bg-surface transition-colors">
                        <Td>
                          <span className="font-playfair font-bold text-[15px]">
                            {profile.full_name ?? '—'}
                          </span>
                        </Td>
                        <Td>{profile.email ?? '—'}</Td>
                        <Td className="text-ink-muted whitespace-nowrap">
                          {new Date(profile.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </Td>
                        <Td>
                          <div className="flex gap-3 flex-wrap">
                            <button
                              onClick={() => generateDigest(profile.id)}
                              className="font-montserrat text-[10px] uppercase tracking-widest border border-ink text-ink px-3 py-1.5 hover:bg-ink hover:text-white transition-colors"
                              id={`admin-gen-${profile.id}`}
                            >
                              Generate Digest
                            </button>
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  message: `Delete user "${profile.full_name ?? profile.email}"? This cannot be undone.`,
                                  onConfirm: () => {
                                    setConfirmModal(null);
                                    deleteProfile(profile.id);
                                  },
                                })
                              }
                              className="font-montserrat text-[10px] uppercase tracking-widest border border-danger text-danger px-3 py-1.5 hover:bg-danger hover:text-white transition-colors"
                              id={`admin-del-${profile.id}`}
                            >
                              Delete
                            </button>
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ─── ALL DIGESTS TAB ───────────────────────────────────────────── */}
        {activeTab === 'digests' && (
          <section>
            <h1 className="font-playfair font-black text-[28px] text-ink mb-6">
              All Digests
            </h1>

            {digestsLoading ? (
              <div className="space-y-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="h-14 bg-surface animate-pulse border border-border" />
                ))}
              </div>
            ) : (
              <div className="border border-border overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <Th>User</Th>
                      <Th>Date</Th>
                      <Th>Status</Th>
                      <Th>Items</Th>
                      <Th>Viewed</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {digests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center font-garamond text-[15px] text-ink-muted italic">
                          No digests found.
                        </td>
                      </tr>
                    ) : digests.map((d) => (
                      <tr key={d.id} className="hover:bg-surface transition-colors">
                        <Td>
                          <p className="font-playfair font-bold text-[14px]">
                            {d.profiles?.full_name ?? '—'}
                          </p>
                          <p className="font-garamond text-[12px] text-ink-muted">
                            {d.profiles?.email ?? d.user_id.slice(0, 8) + '…'}
                          </p>
                        </Td>
                        <Td className="whitespace-nowrap text-ink-muted">
                          {new Date(d.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </Td>
                        <Td><StatusBadge status={d.status} /></Td>
                        <Td className="text-center">{d.item_count ?? '—'}</Td>
                        <Td>
                          <span className={`font-montserrat text-[10px] uppercase tracking-widest ${
                            d.viewed ? 'text-success' : 'text-ink-muted'
                          }`}>
                            {d.viewed ? 'Yes' : 'No'}
                          </span>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ─── DIGEST CONTROL TAB ────────────────────────────────────────── */}
        {activeTab === 'control' && (
          <section>
            <h1 className="font-playfair font-black text-[28px] text-ink mb-8">
              Digest Control
            </h1>

            {/* Generate for specific user */}
            <div className="border border-border p-6 mb-10">
              <h2 className="font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink-muted mb-4">
                Generate Digest for User
              </h2>
              <div className="flex gap-3 flex-wrap items-end">
                <div className="flex-1 min-w-[200px]">
                  <label
                    htmlFor="control-user-select"
                    className="block font-montserrat text-[10px] uppercase tracking-widest text-ink-muted mb-2"
                  >
                    Select User
                  </label>
                  <select
                    id="control-user-select"
                    value={controlUserId}
                    onChange={(e) => setControlUserId(e.target.value)}
                    className="w-full border border-border px-4 py-3 font-garamond text-[14px] text-ink bg-white focus:border-ink focus:outline-none"
                  >
                    <option value="">— Select a user —</option>
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name ?? p.email ?? p.id}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  disabled={!controlUserId || generating}
                  onClick={async () => {
                    setGenerating(true);
                    await generateDigest(controlUserId);
                    setGenerating(false);
                  }}
                  className="bg-ink text-white font-montserrat text-[11px] uppercase tracking-widest px-6 py-3 border border-ink hover:bg-white hover:text-ink transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {generating ? 'Generating…' : 'Generate Digest'}
                </button>
              </div>
            </div>

            {/* Active schedules */}
            <div>
              <h2 className="font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink-muted mb-4">
                Active Schedules
              </h2>

              {schedulesLoading ? (
                <div className="space-y-2">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-14 bg-surface animate-pulse border border-border" />
                  ))}
                </div>
              ) : (
                <div className="border border-border overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <Th>User</Th>
                        <Th>Time</Th>
                        <Th>Interval</Th>
                        <Th>Next Trigger</Th>
                        <Th>Active</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center font-garamond text-[15px] text-ink-muted italic">
                            No schedules configured.
                          </td>
                        </tr>
                      ) : schedules.map((s) => (
                        <tr key={s.id} className="hover:bg-surface transition-colors">
                          <Td>
                            <p className="font-playfair font-bold text-[14px]">
                              {s.profiles?.full_name ?? '—'}
                            </p>
                            <p className="font-garamond text-[12px] text-ink-muted">
                              {s.profiles?.email ?? s.user_id.slice(0, 8) + '…'}
                            </p>
                          </Td>
                          <Td className="font-playfair font-bold">{s.delivery_time}</Td>
                          <Td>{s.interval_hours}h</Td>
                          <Td className="whitespace-nowrap text-ink-muted">
                            {s.next_trigger_at
                              ? new Intl.DateTimeFormat('en-US', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                }).format(new Date(s.next_trigger_at))
                              : '—'}
                          </Td>
                          <Td>
                            <span
                              className={`font-montserrat text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
                                s.is_active
                                  ? 'bg-ink text-white border-ink'
                                  : 'bg-surface text-ink-muted border-border'
                              }`}
                            >
                              {s.is_active ? 'Active' : 'Paused'}
                            </span>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.text} type={toast.type} />}
    </div>
  );
}
