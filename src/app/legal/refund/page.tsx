'use client';

import React from 'react';
import { LegalNav } from '@/components/common/LegalNav';
import { RefreshCw, CheckCircle2 } from "@/components/icons";

export default function RefundPolicyPage() {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <LegalNav />

      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono text-zinc-400">14-Day Money-Back Guarantee</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1 mb-4">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            We want you to be completely satisfied with Shipra Pro and Team subscriptions.
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">14-Day No-Questions-Asked Refund</h2>
            <p>
              If you upgrade to Shipra Pro or Team and find that it doesn&apos;t meet your requirements, you can request a full refund within 14 days of your initial purchase. Email <code>billing@shipra.dev</code> with your account email and invoice ID.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Cancel Anytime</h2>
            <p>
              You can cancel your recurring billing subscription at any time via Dashboard &gt; Billing. Upon cancellation, your plan remains active until the end of the current billing cycle, with zero further charges.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
