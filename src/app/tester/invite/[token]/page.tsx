'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { Smartphone, CheckCircle2, ArrowRight } from "@/components/icons";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default function AcceptTesterInvitePage({ params }: InvitePageProps) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <Smartphone className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono text-zinc-400">Invite Token: {token}</span>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            You&apos;re Invited to Test Android Builds!
          </h1>
          <p className="text-xs text-zinc-500 leading-relaxed">
            HyperCraft Studio has invited you to join their beta testing program on Shipra.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-xs text-left space-y-1">
          <div className="flex justify-between">
            <span className="text-zinc-500">App:</span>
            <span className="font-bold text-zinc-900 dark:text-white">Pulse Fitness &amp; Running</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Channel:</span>
            <span className="text-indigo-500 font-semibold">Beta Track</span>
          </div>
        </div>

        <Link
          href="/tester"
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-1"
        >
          <span>Accept Invitation &amp; Open Portal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
