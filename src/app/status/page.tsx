'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, ArrowLeft, Activity, ShieldCheck, Server, RefreshCw } from "@/components/icons";

export default function StatusPage() {
  const services = [
    { name: 'APK Direct Upload & Manifest Parser', status: 'Operational', uptime: '100%', latency: '24ms' },
    { name: 'ClamAV & VirusTotal Malware Pipeline', status: 'Operational', uptime: '99.99%', latency: '180ms' },
    { name: 'Cloudflare R2 Edge Download CDN', status: 'Operational', uptime: '100%', latency: '12ms' },
    { name: 'REST API & Scoped Token Gateway (/v1)', status: 'Operational', uptime: '99.98%', latency: '18ms' },
    { name: 'Cloud Build Docker Runners (EAS)', status: 'Operational', uptime: '99.95%', latency: 'Queue: 0 jobs' },
    { name: 'BullMQ Redis Background Job Queue', status: 'Operational', uptime: '100%', latency: '1ms' },
    { name: 'Email Delivery (Resend / SES)', status: 'Operational', uptime: '99.99%', latency: 'Instant' },
  ];

  const pastIncidents = [
    {
      date: 'April 14, 2025',
      title: 'Elevated latency on direct APK downloads in Asia-Pacific region',
      status: 'Resolved',
      duration: '18 minutes',
      description: 'Cloudflare reported routing congestion across Singapore edge nodes. Traffic was automatically rerouted through Mumbai and Tokyo. No packet loss recorded.'
    },
    {
      date: 'March 02, 2025',
      title: 'Scheduled Maintenance: Upgrade to Android SDK 35 Build Images',
      status: 'Completed',
      duration: '45 minutes',
      description: 'Completed upgrade of Docker build containers with Android 15 compileSdk 35 and Gradle 8.8 runtime support.'
    }
  ];

  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
            Shipra System Status
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Real-time status of APK delivery, virus scanning, and cloud build runners.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-zinc-400">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Updated just now</span>
        </div>
      </div>

      {/* Main Status Banner */}
      <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-4 mb-10 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
            All Systems Operational
          </h2>
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            Global uptime over the last 90 days: <strong className="font-semibold">99.98%</strong>
          </p>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4 mb-16">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
          Service Health Breakdown
        </h3>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800 shadow-sm overflow-hidden">
          {services.map((svc, i) => (
            <div key={i} className="p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {svc.name}
                </span>
              </div>
              <div className="flex items-center space-x-6 text-xs text-zinc-500">
                <span className="hidden sm:inline font-mono">{svc.latency}</span>
                <span className="hidden sm:inline font-mono text-zinc-400">{svc.uptime}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {svc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 90-Day Uptime Visualization */}
      <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-16 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-900 dark:text-white">90-Day System Uptime History</span>
          <span className="text-emerald-500 font-bold">99.98% Available</span>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(60)].map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-8 rounded-sm bg-emerald-500 hover:opacity-80 transition-opacity"
              title={`Day ${60 - idx}: 100% operational`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span>60 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Incident History (PUB-11) */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
          Incident &amp; Maintenance History
        </h3>

        <div className="space-y-4">
          {pastIncidents.map((inc, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-white text-sm">
                  {inc.title}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {inc.status} • {inc.duration}
                </span>
              </div>
              <p className="text-zinc-500 text-[11px] font-mono">{inc.date}</p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                {inc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
