'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Key, ArrowRight, CheckCircle2 } from "@/components/icons";

export default function TwoFactorPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [useBackup, setUseBackup] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setError('Please enter a valid 6-digit authenticator code or 8-digit backup code.');
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <Shield className="w-7 h-7" />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Two-Factor Verification
          </h2>
          <p className="text-xs text-zinc-500">
            {useBackup
              ? 'Enter one of your 8-digit emergency recovery backup codes.'
              : 'Enter the 6-digit code from Google Authenticator or 1Password.'}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              {useBackup ? 'Backup Code' : 'Authenticator Code'}
            </label>
            <input
              type="text"
              autoFocus
              required
              placeholder={useBackup ? 'ABCD-EFGH' : '123 456'}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-center font-mono text-base font-bold text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-wider"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>Verify &amp; Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => { setUseBackup(!useBackup); setCode(''); setError(''); }}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            {useBackup ? 'Use Authenticator App Instead' : 'Lost device? Use Emergency Backup Code'}
          </button>
        </div>
      </div>
    </div>
  );
}
