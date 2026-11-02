'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Globe, Mail, CheckCircle2, ArrowRight, ShieldCheck, Download, Layers } from "@/components/icons";

interface DevProfileProps {
  params: Promise<{ username: string }>;
}

export default function DevProfilePage({ params }: DevProfileProps) {
  const resolvedParams = use(params);
  const { apps, user } = useApp();
  const username = resolvedParams.username;

  // Filter apps by developer username or fallback
  const devApps = apps.filter((a) => a.developerUsername.toLowerCase() === username.toLowerCase());

  const devInfo = {
    name: devApps[0]?.developerName || user.name,
    username: username,
    bio: 'Mobile platform engineering studio crafting production-grade Android apps. Open distribution advocate.',
    website: devApps[0]?.websiteUrl || 'https://hypercraft.io',
    verified: true,
    totalDownloads: devApps.reduce((acc, a) => acc + a.totalDownloads, 0),
    totalApps: devApps.length
  };

  return (
    <div className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Developer Banner & Card (PAGE-18) */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-zinc-900 to-zinc-900 border border-zinc-200 dark:border-zinc-800 text-white shadow-xl mb-12 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-extrabold text-3xl shadow-lg">
              {devInfo.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {devInfo.name}
                </h1>
                {devInfo.verified && (
                  <span title="Verified Developer" className="p-1 rounded-full bg-blue-500 text-white">
                    <CheckCircle2 className="w-4 h-4 fill-white text-blue-500" />
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-mono">@{devInfo.username}</p>
              <p className="text-xs text-zinc-300 max-w-md pt-1">{devInfo.bio}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs border-t sm:border-t-0 sm:border-l border-zinc-800 pt-4 sm:pt-0 sm:pl-6">
            <div>
              <span className="text-zinc-400 block">Total Downloads</span>
              <span className="text-xl font-extrabold text-emerald-400">{devInfo.totalDownloads.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Public Apps</span>
              <span className="text-xl font-extrabold text-white">{devInfo.totalApps}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Published Apps Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          <span>Published Applications by {devInfo.name}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {devApps.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl border border-zinc-200 dark:border-zinc-700">
                    {app.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                      {app.name}
                    </h3>
                    <p className="text-xs font-mono text-zinc-400">{app.packageName}</p>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      v{app.builds[0]?.versionName || '1.0.0'} • {app.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-6">
                  {app.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500">
                  {app.totalDownloads.toLocaleString()} installs
                </span>
                <Link
                  href={`/a/${app.slug}`}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <span>Install APK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
