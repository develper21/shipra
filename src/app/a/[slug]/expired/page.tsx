'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, AlertCircle, CheckCircle2, ArrowLeft } from "@/components/icons";

export default function ExpiredLinkPage() {
  const [requestedEmail, setRequestedEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            Link Has Expired
          </h1>
          <p className="text-xs text-zinc-500 leading-relaxed">
            This APK test build was published with a temporary download lifetime or download quota that has now ended.
          </p>
        </div>

        {sent ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Request sent! The developer has been notified.</span>
          </div>
        ) : (
          <form onSubmit={handleRequestAccess} className="space-y-3">
            <input
              type="email"
              required
              placeholder="Enter your email to request fresh build..."
              value={requestedEmail}
              onChange={(e) => setRequestedEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Request Access from Developer
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shipra Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
