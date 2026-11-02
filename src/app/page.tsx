'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { translations } from '@/lib/translations';
import confetti from 'canvas-confetti';
import { 
  Rocket, 
  ArrowRight, 
  ShieldCheck, 
  QrCode, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Smartphone, 
  Share2, 
  Layers, 
  Terminal, 
  Lock, 
  Users, 
  Check, 
  X as CloseIcon, 
  ExternalLink,
  ChevronRight,
  Code2,
  FileCheck,
  Star,
  Cpu
} from "@/components/icons";

export default function HomePage() {
  const { lang, apps } = useApp();
  const t = translations[lang];

  // Interactive Live Demo Simulator State
  const [demoState, setDemoState] = useState<'idle' | 'uploading' | 'scanning' | 'ready'>('idle');
  const [demoProgress, setDemoProgress] = useState(0);

  const startDemoSimulation = () => {
    setDemoState('uploading');
    setDemoProgress(15);
    
    setTimeout(() => setDemoProgress(55), 400);
    setTimeout(() => {
      setDemoProgress(100);
      setDemoState('scanning');
    }, 900);

    setTimeout(() => {
      setDemoState('ready');
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }, 1800);
  };

  const resetDemo = () => {
    setDemoState('idle');
    setDemoProgress(0);
  };

  const comparisonData = [
    {
      feature: 'Cost & Unlimited Uploads',
      shipra: '100% Free & Open-Source (Unlimited)',
      expo: 'Paid tier required for high volume',
      firebase: 'Free, but requires Google account for all testers',
      diawi: 'Only 3 installations per link on free tier'
    },
    {
      feature: 'Framework Agnostic (Flutter, Native, RN, Unity)',
      shipra: 'Yes, any .apk binary works natively',
      expo: 'Prioritizes Expo & React Native',
      firebase: 'Yes',
      diawi: 'Yes'
    },
    {
      feature: 'Permanent Latest Version Link (/latest)',
      shipra: 'Yes, permanent URL per channel',
      expo: 'Manual release channel routing',
      firebase: 'No, every build gets a separate URL',
      diawi: 'No, links expire in 1-3 days'
    },
    {
      feature: 'Built-in Malware & Virus Scanning',
      shipra: 'ClamAV + VirusTotal 72-engine Heuristics',
      expo: 'Basic Play Protect only',
      firebase: 'Google internal check',
      diawi: 'None'
    },
    {
      feature: 'Smart Android vs Desktop Detection',
      shipra: 'Android gets 1-Tap APK, Desktop gets QR',
      expo: 'Redirects to web dashboard',
      firebase: 'Requires Firebase App Tester app',
      diawi: 'Generic landing page'
    },
    {
      feature: 'Self-Hostable with S3/R2 storage',
      shipra: 'Yes, Docker & Node.js 1-click deploy',
      expo: 'No, proprietary cloud',
      firebase: 'No, Google Cloud lock-in',
      diawi: 'No, proprietary'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section (PUB-01) */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/20 to-purple-500/10 blur-[120px] pointer-events-none -z-10 rounded-full" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-top-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>The Open Source Free Expo Internal Distribution Alternative</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-5xl mx-auto leading-[1.1] mb-6">
            Deploy & Distribute <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Android APKs Without Limits
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-10">
            {t.heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Rocket className="w-5 h-5" />
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Live Interactive Simulator Card (PUB-01 demo) */}
          <div className="max-w-4xl mx-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 shadow-2xl backdrop-blur-xl p-6 sm:p-8 text-left transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-6 gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-zinc-400 pl-2">
                  shipra-engine: fast-distribute-v2.apk
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Interactive Playground</span>
                </span>
              </div>
            </div>

            {demoState === 'idle' && (
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-8 sm:p-12 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors bg-zinc-50/50 dark:bg-zinc-950/40">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1.5">
                  Drop your Android APK here
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
                  Supports universal APKs from React Native, Expo, Flutter, Kotlin, Unity or Capacitor. Up to 1 GB direct upload.
                </p>
                <button
                  onClick={startDemoSimulation}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 transition-all cursor-pointer hover:scale-105"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Simulate Instant APK Upload & Parse</span>
                </button>
              </div>
            )}

            {demoState === 'uploading' && (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto animate-pulse">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                    Uploading MyApp-v2.1.0-release.apk (34.2 MB)
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">Direct-to-storage stream via pre-signed Cloudflare R2 URL...</p>
                </div>
                <div className="w-full max-w-md mx-auto bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${demoProgress}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-zinc-400">{demoProgress}% complete</span>
              </div>
            )}

            {demoState === 'scanning' && (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto animate-spin">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                    Running ClamAV & VirusTotal Heuristics...
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Validating manifest permissions, package uniqueness, and SHA-256 fingerprint.
                  </p>
                </div>
              </div>
            )}

            {demoState === 'ready' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                        APK Ready for Instant Distribution!
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        Package: <span className="font-mono">com.demo.myapp</span> (Version 2.1.0 • Min Android 8.0)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetDemo}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-white underline cursor-pointer"
                  >
                    Reset Demo
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                        Permanent Shareable URL
                      </span>
                      <p className="text-sm font-mono font-medium text-indigo-600 dark:text-indigo-400 mt-0.5 truncate">
                        https://shipra.dev/a/myapp/latest
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-zinc-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Scanned Clean (0/72 engines flagged)</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href="/a/pulse-fitness"
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center space-x-1"
                      >
                        <span>Open Public Install Page</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href="/dashboard"
                        className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                      >
                        Manage in Dashboard
                      </Link>
                    </div>
                  </div>

                  {/* High-res QR preview */}
                  <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-xl shadow-md border border-zinc-200">
                      <QrCode className="w-20 h-20 text-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-xs text-zinc-900 dark:text-white">
                        Scan from Android
                      </p>
                      <p className="text-[11px] text-zinc-500 leading-tight">
                        Point phone camera to install directly onto device.
                      </p>
                      <span className="inline-block text-[10px] text-indigo-500 font-mono">
                        Auto-detected as Mobile APK
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it Works Section (PUB-02) */}
      <section className="py-20 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Simple 3-Step Flow
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {t.howItWorks}
            </p>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3">
              Zero complicated configurations, zero SDK installations needed to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">
                {t.howStep1Title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.howStep1Desc}
              </p>
              <div className="mt-4 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
                $ npm i -g shipra &amp;&amp; shipra upload app.apk
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">
                {t.howStep2Title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.howStep2Desc}
              </p>
              <div className="mt-4 flex items-center space-x-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Automated quarantine &amp; virus signature match</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">
                {t.howStep3Title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.howStep3Desc}
              </p>
              <div className="mt-4 flex items-center space-x-2 text-[11px] text-zinc-500">
                <QrCode className="w-4 h-4 text-indigo-500" />
                <span>WhatsApp, Telegram &amp; SMS 1-tap share</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid (PUB-03) */}
      <section className="py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Engineering First
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {t.featuresTitle}
            </p>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3">
              Everything modern mobile developers need to share test builds with QA, clients, and early adopters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-indigo-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-2">
                Auto-Parse APK Manifest
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Instantly extracts package name, version code, target SDK 35, requested permissions list, supported ABIs, and digital signature thumbprints.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-indigo-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-2">
                ClamAV &amp; VirusTotal Scanning
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Protect your domain reputation. Every uploaded binary is scanned before publishing to detect adware, banking trojans, and phishing mods.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-indigo-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-2">
                Permanent Latest Link
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Give your QA team a single permanent link (<code className="font-mono text-[11px]">/a/my-app/latest</code>). Whenever you upload a new build, they always get the latest version.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-indigo-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-2">
                Release Channels &amp; Rollback
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Separate Production, Beta, Internal, and QA channels. Promote a build from Beta to Production with 1 click, or rollback instantly if a regression occurs.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-indigo-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-2">
                Password &amp; Whitelist Gate
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Share private pre-release client builds protected with custom passwords, email whitelists, or expiration dates (24h, 7d, 30d).
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-indigo-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-2">
                Cloud Build &amp; CI/CD Actions
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                EAS-style isolated Docker build runners, GitHub Actions official workflow, CLI tool (<code className="font-mono text-[11px]">shipra</code>), and REST API tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table (PUB-04) */}
      <section className="py-20 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Objective Comparison
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {t.comparisonTitle}
            </p>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3">
              How Shipra stacks up against Expo Internal Distribution, Firebase App Distribution, and Diawi.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-950/70 font-semibold text-zinc-900 dark:text-white">
                <tr>
                  <th className="p-4 sm:p-5">Capability / Feature</th>
                  <th className="p-4 sm:p-5 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 font-bold">
                    Shipra (Open Source)
                  </th>
                  <th className="p-4 sm:p-5">Expo Internal</th>
                  <th className="p-4 sm:p-5">Firebase App Dist.</th>
                  <th className="p-4 sm:p-5">Diawi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                {comparisonData.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-zinc-900 dark:text-white">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 bg-indigo-50/30 dark:bg-indigo-950/10 font-semibold text-indigo-600 dark:text-indigo-400">
                      {row.shipra}
                    </td>
                    <td className="p-4 sm:p-5 text-zinc-500">{row.expo}</td>
                    <td className="p-4 sm:p-5 text-zinc-500">{row.firebase}</td>
                    <td className="p-4 sm:p-5 text-zinc-500">{row.diawi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials and Trust Logos (PUB-20) */}
      <section className="py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Loved by Mobile Engineers
            </h2>
            <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Trusted by 10,000+ Android Developers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                &ldquo;We replaced Diawi and Firebase App Distribution with Shipra across our agency. The permanent /latest link and instant QR code cut our client test iterations from days to seconds.&rdquo;
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Aarav"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Aarav Sharma</h4>
                  <p className="text-[11px] text-zinc-500">Lead Mobile Architect, HyperCraft</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                &ldquo;Being able to drop a Flutter APK and immediately get virus scan confirmation plus a mobile-optimized install page without paying monthly seat licenses is a godsend for indie builders.&rdquo;
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Rohan"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Rohan Mehta</h4>
                  <p className="text-[11px] text-zinc-500">Full-Stack Flutter Developer</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                &ldquo;The Cloud Build integration and GitHub Action hooked into our repo in under 5 minutes. Every time we merge, our internal drivers get a WhatsApp push with the update link.&rdquo;
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Neha"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Neha Verma</h4>
                  <p className="text-[11px] text-zinc-500">DevOps &amp; QA Lead, FinFlow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 border-t border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-transparent to-indigo-950/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
            Ready to distribute your next Android APK?
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mb-8">
            Start uploading APKs in seconds. No credit card required. Free forever for open-source and individual developers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/25 transition-all cursor-pointer"
            >
              Get Started Free (Open Source)
            </Link>
            <Link
              href="/docs"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
