'use client';

import React from 'react';
import Link from 'next/link';
import { changelog } from '@/lib/content';
import { Tag, Sparkles, CheckCircle2, ArrowRight } from "@/components/icons";

export default function ChangelogPage() {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 block">
          Product Releases
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
          Changelog &amp; Updates
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
          All notable features, enhancements, and security fixes delivered to Shipra.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-indigo-200 dark:border-indigo-950 pl-6 sm:pl-8 space-y-12">
        {changelog.map((entry, idx) => (
          <div key={idx} className="relative">
            {/* Timeline Marker */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-zinc-950 shadow-sm" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {entry.version}
                </span>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {entry.title}
                </h2>
              </div>
              <span className="text-xs text-zinc-400">{entry.date}</span>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-3">
              {entry.changes.map((change, cIdx) => (
                <div key={cIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{change}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-500/20"
        >
          <span>Test New Features in Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
