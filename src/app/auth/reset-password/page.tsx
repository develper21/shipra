'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, CheckCircle2, ArrowRight } from "@/components/icons";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Choose New Password
          </h2>
          <p className="text-xs text-zinc-500">
            Enter a strong and secure password for your account.
          </p>
        </div>

        {success ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs text-center space-y-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
            <p className="font-bold">Password has been successfully updated!</p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center space-x-1 font-semibold text-white bg-indigo-600 px-4 py-2 rounded-xl text-xs"
              >
                <span>Proceed to Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 text-xs">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              Update Password &amp; Log In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
