'use client';

import React from 'react';
import { LegalNav } from '@/components/common/LegalNav';
import { ShieldCheck, Lock } from "@/components/icons";

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <LegalNav />

      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono text-zinc-400">Compliance: EU GDPR &amp; India Digital Personal Data Protection (DPDP) Act</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Your privacy and tester data sovereignty are fundamental to Shipra. We practice strict data minimization and zero third-party telemetry selling.
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">1. Information We Collect</h2>
            <p>
              When an engineer uploads an APK, we extract manifest metadata necessary to display the install page (app package name, version, icons, permissions requested). When a tester visits a download link, we record anonymous telemetry (anonymized IP hash, device model string, and Android OS version) solely for developer analytics.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">2. Privacy-Friendly IP Anonymization (ANL-10)</h2>
            <p>
              We do not store raw IPv4 or IPv6 addresses. All IP addresses hitting public install endpoints are salted and one-way SHA-256 hashed to count unique downloads while preventing user tracking or profiling.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">3. Your Data Subject Rights (GDPR &amp; India DPDP)</h2>
            <p>
              Under GDPR and India DPDP regulations, you retain full rights to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Export all stored metadata, build history, and audit records in JSON format via Account Settings</li>
              <li>Request immediate and irreversible deletion of your account and associated storage binaries</li>
              <li>Revoke active sessions and OAuth authorizations at any moment</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">4. Data Processing &amp; Storage Location</h2>
            <p>
              Files and binaries are stored on Cloudflare R2 object storage with global edge replication. Database records are encrypted at rest with AES-256.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
