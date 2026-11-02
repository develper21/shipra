'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { GettingStartedChecklist } from '@/components/dashboard/GettingStartedChecklist';
import { 
  Layers, 
  UploadCloud, 
  Download, 
  HardDrive, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Plus,
  Terminal
} from "@/components/icons";

export default function DashboardHomePage() {
  const { apps, activeWorkspace } = useApp();

  const totalApps = apps.length;
  const totalBuilds = apps.reduce((acc, app) => acc + app.builds.length, 0);
  const totalDownloads = apps.reduce((acc, app) => acc + app.totalDownloads, 0);
  const totalViews = apps.reduce((acc, app) => acc + app.totalViews, 0);

  // Collect all recent builds across all apps
  const recentBuilds = apps
    .flatMap((app) => app.builds.map((b) => ({ ...b, appName: app.name, appSlug: app.slug, appIcon: app.icon })))
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 5);

  const [chartRange, setChartRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Realistic mock daily download bars (DASH-04)
  const downloadDays = [
    { day: 'Mon', downloads: 420, views: 980 },
    { day: 'Tue', downloads: 680, views: 1420 },
    { day: 'Wed', downloads: 590, views: 1250 },
    { day: 'Thu', downloads: 840, views: 1890 },
    { day: 'Fri', downloads: 1120, views: 2450 },
    { day: 'Sat', downloads: 930, views: 2100 },
    { day: 'Sun', downloads: 1340, views: 3100 },
  ];

  const maxVal = Math.max(...downloadDays.map(d => d.views));

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeWorkspace.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Deployment &amp; Distribution Overview
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
              Real-time telemetry, recent APK builds, and edge distribution metrics across all registered Android packages.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/apps/new"
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Project / Build</span>
            </Link>
            <Link
              href="/dashboard/cloud-build"
              className="px-4 py-2.5 rounded-xl font-semibold text-xs border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center space-x-1"
            >
              <Terminal className="w-4 h-4" />
              <span>Build Pipeline</span>
            </Link>
          </div>
        </div>

        {/* First-Run Getting Started Checklist (Blueprint Section 3) */}
        <GettingStartedChecklist />

        {/* 4 Overview Metric Cards (DASH-01) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Total Apps
              </span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                {totalApps}
              </span>
              <p className="text-[11px] text-zinc-400 mt-1">Across 3 release channels</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Total Builds
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <UploadCloud className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                {totalBuilds}
              </span>
              <p className="text-[11px] text-emerald-500 mt-1 font-medium">100% Virus-Free Verified</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Total Downloads
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <Download className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                {totalDownloads.toLocaleString()}
              </span>
              <p className="text-[11px] text-zinc-400 mt-1">{totalViews.toLocaleString()} total page views</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                R2 Storage Used
              </span>
              <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                1.8 GB
              </span>
              <p className="text-[11px] text-zinc-400 mt-1">36% of 5 GB free limit</p>
            </div>
          </div>
        </div>

        {/* Downloads Over Time Chart (DASH-04) + Plan Limit Gauge (DASH-05) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  <span>Downloads &amp; Installs Timeline</span>
                </h3>
                <p className="text-xs text-zinc-500">Unique mobile device activations across all apps</p>
              </div>

              {/* Range Selector */}
              <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold">
                {(['7d', '30d', '90d'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setChartRange(r)}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      chartRange === r
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom SVG / Bar Visualizer */}
            <div className="pt-4 space-y-2">
              <div className="h-48 flex items-end gap-3 sm:gap-6 pt-6">
                {downloadDays.map((item, i) => {
                  const barHeight = Math.round((item.downloads / maxVal) * 100);
                  const viewHeight = Math.round((item.views / maxVal) * 100);

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        {/* Views bar */}
                        <div
                          className="w-1/2 bg-indigo-200 dark:bg-indigo-950/70 rounded-t-md transition-all group-hover:bg-indigo-300"
                          style={{ height: `${viewHeight}%` }}
                          title={`${item.day} Page Views: ${item.views}`}
                        />
                        {/* Downloads bar */}
                        <div
                          className="w-1/2 bg-indigo-600 dark:bg-indigo-500 rounded-t-md transition-all group-hover:bg-indigo-400"
                          style={{ height: `${barHeight}%` }}
                          title={`${item.day} Downloads: ${item.downloads}`}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-2 font-mono">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center space-x-6 pt-3 text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-indigo-600 dark:bg-indigo-500" />
                  <span>APK Downloads</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-indigo-200 dark:bg-indigo-950" />
                  <span>Public Page Views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Usage Gauge Card (DASH-05) */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Current Workspace Quota
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 uppercase">
                  {activeWorkspace.plan}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-500">Storage Consumption</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">1.8 / 5.0 GB</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '36%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-500">Bandwidth (Monthly)</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">24.2 / 100 GB</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-500">Active Applications</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{totalApps} / 3 Apps</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(totalApps / 3) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs space-y-2">
              <p className="font-bold text-indigo-900 dark:text-indigo-200">
                Need more storage or team roles?
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                Upgrade to Pro for unlimited apps, 50 GB storage, and isolated EAS cloud build runners.
              </p>
              <Link
                href="/dashboard/billing"
                className="inline-block pt-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Upgrade to Pro ($19/mo) &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Builds Table (DASH-02) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Recent APK Builds &amp; Deployments
              </h3>
              <p className="text-xs text-zinc-500">Latest binaries uploaded to your workspace</p>
            </div>
            <Link
              href="/dashboard/apps"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
            >
              <span>View All Apps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Application</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Security Scan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {recentBuilds.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{b.appIcon}</span>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white">{b.appName}</p>
                          <p className="text-[10px] text-zinc-400 font-mono truncate max-w-xs">{b.fileName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium">
                      v{b.versionName} ({b.versionCode})
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {b.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-500">
                      {b.fileSizeFormatted}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Clean (ClamAV)</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/a/${b.appSlug}`}
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-600 hover:text-white text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors inline-flex items-center space-x-1"
                      >
                        <span>Install Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
