'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { 
  User, 
  Lock, 
  Shield, 
  Smartphone, 
  Download, 
  Trash2, 
  Check, 
  Key, 
  Globe, 
  Mail,
  AlertCircle
} from "@/components/icons";

export default function AccountSettingsPage() {
  const { user, setUser } = useApp();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [website, setWebsite] = useState(user.website || '');
  const [email, setEmail] = useState(user.email);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sessions state (AUTH-07)
  const [sessions, setSessions] = useState(user.activeSessions);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      username,
      bio,
      website,
      email,
      twoFactorEnabled
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `applaunch_user_export_${user.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            Account &amp; Security Settings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage your developer profile, 2FA credentials, active sessions, and data sovereignty.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Profile and settings saved successfully!</span>
          </div>
        )}

        {/* Profile Details (AUTH-12) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
            <User className="w-4 h-4 text-indigo-500" />
            <span>Developer Profile (AUTH-12)</span>
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="flex items-center space-x-4 pb-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-700"
              />
              <div>
                <button
                  type="button"
                  onClick={() => alert('Avatar upload dialog simulation.')}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Change Avatar Photo
                </button>
                <p className="text-[10px] text-zinc-400 mt-1">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Public Username (dev/:username)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Primary Email (AUTH-13)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Developer Website URL
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Bio
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
            >
              Save Profile Updates
            </button>
          </form>
        </div>

        {/* Security & 2FA (AUTH-08, AUTH-14) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            <span>Two-Factor Authentication &amp; Password (AUTH-08)</span>
          </h2>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="font-bold text-zinc-900 dark:text-white text-sm">
                TOTP Authenticator (Google Auth / 1Password)
              </p>
              <p className="text-zinc-500 text-xs">Require a 6-digit verification code when logging in.</p>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                twoFactorEnabled
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              {twoFactorEnabled ? '2FA Enabled' : 'Enable 2FA'}
            </button>
          </div>
        </div>

        {/* Active Sessions (AUTH-07) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-indigo-500" />
            <span>Active Login Sessions (AUTH-07)</span>
          </h2>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {sessions.map((sess) => (
              <div key={sess.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-zinc-900 dark:text-white">{sess.device}</span>
                    {sess.current && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-[11px] font-mono">
                    {sess.browser} • {sess.location} ({sess.ip}) • {sess.lastActive}
                  </p>
                </div>
                {!sess.current && (
                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="text-rose-500 hover:text-rose-600 font-semibold cursor-pointer"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Export & Account Deletion (AUTH-16, AUTH-17 GDPR/DPDP) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Data Sovereignty &amp; Privacy (GDPR / India DPDP)
          </h2>
          <p className="text-zinc-500">
            Export all your registered apps, build logs, and tester records in standardized JSON format.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export All My Data (JSON) (AUTH-17)</span>
            </button>
            <button
              onClick={() => alert('Account deletion flow: Please export your data first.')}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account (AUTH-16)</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
