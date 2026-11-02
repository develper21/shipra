'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, ArrowLeft, Search } from "@/components/icons";

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <Rocket className="w-10 h-10 rotate-45" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            404 Error
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            App or Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            The APK build, share link, or page you were looking for doesn&apos;t exist or may have been moved to another channel.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
          >
            Developer Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
