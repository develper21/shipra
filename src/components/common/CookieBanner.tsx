'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Cookie, X } from "@/components/icons";

export const CookieBanner: React.FC = () => {
  const { cookieConsentAccepted, setCookieConsentAccepted } = useApp();

  if (cookieConsentAccepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">
            Privacy & Cookie Preferences
          </p>
          We use strictly essential cookies and anonymous analytics to monitor download speeds and safeguard against malware distribution. Read our{' '}
          <Link href="/legal/cookies" className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-500">
            Cookie Policy
          </Link>.
        </div>
      </div>
      <div className="mt-3.5 flex items-center justify-end space-x-2">
        <button
          onClick={() => setCookieConsentAccepted(true)}
          className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Essential Only
        </button>
        <button
          onClick={() => setCookieConsentAccepted(true)}
          className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
        >
          Accept All
        </button>
      </div>
    </div>
  );
};
