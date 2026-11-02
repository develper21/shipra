'use client';

import React from 'react';
import { LegalNav } from '@/components/common/LegalNav';
import { ShieldCheck } from "@/components/icons";

export default function TermsPage() {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <LegalNav />

      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono text-zinc-400">Last updated: May 20, 2025</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1 mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Welcome to Shipra. By creating an account, uploading an Android APK, or downloading test builds, you agree to comply with and be bound by the following terms.
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">1. Developer Responsibilities</h2>
            <p>
              Developers uploading APK binaries confirm that they possess all necessary copyrights, intellectual property licenses, and distribution rights for the packaged assets. You may not distribute binaries containing trojans, spyware, deceptive banking interfaces, or illegal circumvention tools.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">2. Automated Sandboxing &amp; Security Audits</h2>
            <p>
              All uploaded packages are automatically passed through ClamAV heuristic scanners, VirusTotal engines, and static manifest inspection tools. Shipra reserves the right to immediately quarantine and revoke public download URLs for any APK that triggers malware heuristics or impersonates recognized financial institutions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">3. Platform Availability &amp; Bandwidth Usage</h2>
            <p>
              Shipra delivers files via globally distributed edge networks. Free plan users are subject to fair usage bandwidth guidelines (100 GB/month). Abuse of direct download endpoints via automated bot scraping or DDoS behavior will result in automatic IP rate limiting.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">4. Limitation of Liability</h2>
            <p>
              Shipra provides distribution infrastructure &ldquo;as is&rdquo;. Android applications downloaded via external links are installed at the tester&apos;s own discretion under standard Android sideloading precautions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
