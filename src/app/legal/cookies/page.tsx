'use client';

import React from 'react';
import { LegalNav } from '@/components/common/LegalNav';
import { Cookie, Check } from "@/components/icons";

export default function CookiePolicyPage() {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <LegalNav />

      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono text-zinc-400">Strict Privacy Stance</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1 mb-4">
            Cookie Policy
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Shipra uses strictly necessary session cookies and privacy-respecting client preferences to deliver secure APK downloads.
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">What Cookies We Use</h2>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 font-semibold flex justify-between">
                <span>Cookie Name</span>
                <span>Purpose &amp; Lifespan</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="font-mono">__applaunch_sess</span>
                <span className="text-zinc-500">Encrypted user authentication session (Strictly Essential)</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="font-mono">applaunch_theme</span>
                <span className="text-zinc-500">Dark / Light UI preference (1 Year)</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="font-mono">applaunch_cookie_consent</span>
                <span className="text-zinc-500">Stores cookie acceptance banner state (1 Year)</span>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Zero Third-Party Advertising Trackers</h2>
            <p>
              We do not embed third-party advertising tracking pixels (such as Meta Pixel or Google Ads tracking).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
