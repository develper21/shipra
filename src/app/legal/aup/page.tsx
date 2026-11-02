'use client';

import React from 'react';
import { LegalNav } from '@/components/common/LegalNav';
import { ShieldAlert, AlertTriangle } from "@/components/icons";

export default function AupPage() {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <LegalNav />

      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono text-zinc-400">Strict Enforcement Policy</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1 mb-4">
            Acceptable Use Policy (AUP)
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Shipra provides an open, accessible platform for mobile application distribution. To preserve trust with internet service providers and Android security vendors, strict boundaries are enforced.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Zero Tolerance on Malicious Software:</strong>
            Any account attempting to distribute malware, spyware, banking SMS hijackers, or pirated copyrighted material will be permanently terminated immediately and reported to cybersecurity authorities.
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Prohibited Activities</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Malware &amp; Ransomware:</strong> Distributing binaries containing backdoors, keyloggers, botnet agents, or trojans.</li>
              <li><strong>Financial Phishing:</strong> Impersonating official banking applications (e.g. SBI, HDFC, Chase, PayPal) or crypto wallets to steal credentials.</li>
              <li><strong>Unauthorized Accessibility Services:</strong> Exploiting Android Accessibility APIs to hijack user clicks or tap streams without consent.</li>
              <li><strong>Piracy &amp; Cracks:</strong> Hosting modified APKs containing bypassed license verification, cracked in-app purchases, or stolen intellectual property.</li>
              <li><strong>Resource Exhaustion:</strong> Conducting bandwidth flood attacks or utilizing automated scrapers against public download mirrors.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Automated Remediation &amp; Quarantine</h2>
            <p>
              Our ClamAV heuristic pipeline checks every binary upon upload. If a bad signature is matched, the binary is quarantined immediately and the developer&apos;s workspace is flagged for administrative review.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
