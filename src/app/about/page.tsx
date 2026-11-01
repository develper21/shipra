'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, ShieldCheck, Heart, Globe2, Sparkles, Check } from "@/components/icons";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
          Our Open Source Mission
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Democratizing Mobile App Deployment
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          We built Shipra because distributing Android test builds to clients and testers was bogged down by closed store delays, strict proprietary cloud fees, and artificial limits.
        </p>
      </div>

      <div className="space-y-12 text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
        <section className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>Why Shipra Exists</span>
          </h2>
          <p>
            When web developers build with Vercel or Netlify, they enjoy instant preview deployments on every Git push. In the mobile world, however, testing an Android build has always been painful. Expo Internal Distribution works nicely but locks teams into paid EAS queues; Google Play Internal tracks take hours to process; and services like Diawi limit free installs to 3 downloads per link before demanding subscriptions.
          </p>
          <p>
            Shipra is <strong>100% framework-agnostic</strong>, <strong>open-source</strong>, and backed by high-performance Cloudflare R2 object storage. Whether your team compiles with Expo, vanilla React Native, Flutter, Kotlin, or Unity, you get instant distribution in seconds.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Zero Lock-In</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Self-hostable via Docker or use our managed cloud. Works with any standard .apk binary file.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Security at Core</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Integrated ClamAV and VirusTotal multi-engine scanning prevents malware proliferation.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Developer First</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Official GitHub Actions, OpenAPI documentation, and npm CLI tool for terminal power users.
            </p>
          </div>
        </section>

        <section className="text-center pt-8">
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-500/20"
          >
            <span>Get in Touch with the Core Team</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
