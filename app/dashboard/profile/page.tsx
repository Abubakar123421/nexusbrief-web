'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import Topbar from '@/components/Topbar';

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string | null;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-montserrat text-[11px] uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1.5 mt-4">
      {children}
    </label>
  );
}

function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="border border-[#E0DDD8] px-4 py-3.5 w-full font-garamond text-[15px] text-[#0A0A0A] focus:border-[#0A0A0A] focus:outline-none transition-colors bg-transparent placeholder-[#8A8A8A]"
    />
  );
}

export default function ProfilePage() {
  const supabase = createBrowserSupabaseClient();

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) {
        setProfile(data);
        setName(data.name ?? '');
        setEmail(data.email ?? user.email ?? '');
        setOriginalEmail(data.email ?? user.email ?? '');
      }
    }
    load();
  }, [supabase]);

  function isValidEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    if (!name.trim()) {
      setProfileMsg({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }
    if (!isValidEmail(email)) {
      setProfileMsg({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setProfileLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: profileErr } = await supabase
        .from('profiles')
        .update({ name: name.trim(), email: email.trim() })
        .eq('id', user.id);

      if (profileErr) throw profileErr;

      if (email.trim() !== originalEmail) {
        const { error: authErr } = await supabase.auth.updateUser({ email: email.trim() });
        if (authErr) throw authErr;
        setOriginalEmail(email.trim());
      }

      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err?.message ?? 'Failed to update profile.' });
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (!newPassword) {
      setPwMsg({ type: 'error', text: 'Please enter a new password.' });
      return;
    }
    if (newPassword.length < 8) {
      setPwMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setPwLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPwMsg({ type: 'success', text: 'Password changed successfully.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err?.message ?? 'Failed to change password.' });
    } finally {
      setPwLoading(false);
    }
  }

  function formatMemberSince(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      <Topbar title="My Profile" />
      <main className="flex-1 overflow-y-auto px-8 py-8 max-w-4xl mx-auto w-full">
        {/* Page header */}
        <div className="mb-8">
          <p className="font-montserrat text-[10px] uppercase tracking-widest text-[#8A8A8A] mb-1">
            ACCOUNT
          </p>
          <h1 className="font-playfair font-black text-[36px] text-[#0A0A0A] leading-tight">
            My Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="border border-[#E0DDD8] p-8 max-w-lg mb-6">
          <h2 className="font-playfair font-bold text-[20px] text-[#0A0A0A] mb-6">
            Account Information
          </h2>

          {profile?.created_at && (
            <p className="font-montserrat text-[11px] text-[#8A8A8A]">
              Member since {formatMemberSince(profile.created_at)}
            </p>
          )}

          <form onSubmit={handleSaveProfile} noValidate>
            <FieldLabel>Full Name</FieldLabel>
            <FieldInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />

            <FieldLabel>Email Address</FieldLabel>
            <FieldInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            {profileMsg && (
              <p
                className={`font-garamond text-[14px] mt-4 ${
                  profileMsg.type === 'success' ? 'text-[#3D3D3D]' : 'text-red-600'
                }`}
              >
                {profileMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              className="mt-6 w-full bg-[#0A0A0A] text-[#FFFFFF] font-montserrat text-[11px] uppercase tracking-[0.12em] py-3.5 hover:bg-[#3D3D3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {profileLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E0DDD8] my-8 max-w-lg" />

        {/* Password Card */}
        <div className="border border-[#E0DDD8] p-8 max-w-lg">
          <h2 className="font-playfair font-bold text-[20px] text-[#0A0A0A] mb-2">
            Change Password
          </h2>
          <p className="font-garamond text-[14px] text-[#8A8A8A] mb-4">
            Choose a strong password of at least 8 characters.
          </p>

          <form onSubmit={handleChangePassword} noValidate>
            <FieldLabel>New Password</FieldLabel>
            <FieldInput
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />

            <FieldLabel>Confirm New Password</FieldLabel>
            <FieldInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />

            {pwMsg && (
              <p
                className={`font-garamond text-[14px] mt-4 ${
                  pwMsg.type === 'success' ? 'text-[#3D3D3D]' : 'text-red-600'
                }`}
              >
                {pwMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={pwLoading}
              className="mt-6 w-full bg-[#0A0A0A] text-[#FFFFFF] font-montserrat text-[11px] uppercase tracking-[0.12em] py-3.5 hover:bg-[#3D3D3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pwLoading ? 'Updating…' : 'Change Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
