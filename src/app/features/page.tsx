'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileCheck, 
  ShieldCheck, 
  QrCode, 
  Layers, 
  Terminal, 
  Users, 
  BarChart3, 
  Check, 
  ArrowRight,
  Sparkles,
  Lock,
  Globe2,
  Cpu,
  RefreshCw
} from "@/components/icons";

export default function FeaturesPage() {
  const featureSections = [
    {
      id: 'apk-parsing',
      tag: 'Core Engine',
      title: 'Automated APK Parsing & Deep Binary Inspection',
      desc: 'Never write manual version strings again. The moment you upload an APK, our background worker parses AndroidManifest.xml and binary assets directly.',
      icon: FileCheck,
      color: 'from-blue-600 to-indigo-600',
      bullets: [
        'Automatic extraction of package name, versionCode, versionName, and app icon',
        'Target SDK and minimum Android version compatibility check (Android 7.0 through Android 15)',
        'Full list of declared android.permission strings categorized by security risk',
        'Native ABI extraction (arm64-v8a, armeabi-v7a, x86_64)',
        'SHA-256 binary checksum computation for cryptographic verification'
      ]
    },
    {
      id: 'malware-scanning',
      tag: 'Zero-Trust Security',
      title: 'ClamAV & VirusTotal Multi-Engine Malware Scanning',
      desc: 'Distributing raw APKs comes with immense responsibility. Shipra isolates every binary in a sandboxed quarantine queue before making it accessible.',
      icon: ShieldCheck,
      color: 'from-emerald-600 to-teal-600',
      bullets: [
        'Multi-engine antivirus heuristic analysis across 70+ security vendors via VirusTotal integration',
        'Detects unauthorized overlay permissions, SMS harvesters, and banking app spoofing',
        'Digital signature verification: warns testers if the APK was signed with an insecure debug key',
        'One-click emergency administrative takedowns and automatic bad-hash blocklists',
        'Zero malware guarantee: builds with high-risk heuristic flags are automatically blocked'
      ]
    },
    {
      id: 'smart-distribution',
      tag: 'Instant Distribution',
      title: 'Smart Device Detection, Dynamic QR & Permanent Links',
      desc: 'Seamless sharing for QA testers, executives, and clients. No logins or third-party test apps required.',
      icon: QrCode,
      color: 'from-violet-600 to-purple-600',
      bullets: [
        'Permanent /a/your-app/latest link that dynamically points to the newest published APK',
        'Smart device sensing: Android phones get a prominent 1-Tap Download button; Desktop screens get a high-res QR code',
        'High-resolution QR code generator with SVG and PNG download formats for release notes or slides',
        'One-tap sharing to WhatsApp, Telegram, Slack, Email, and SMS',
        'Optional password protection, download rate limiters, and self-destructing expiry timers (24h, 7d, 30d)'
      ]
    },
    {
      id: 'channels-rollouts',
      tag: 'Version Control',
      title: 'Multi-Channel Releases, Staged Rollouts & Rollbacks',
      desc: 'Structure your deployment pipeline cleanly across Production, Beta, Internal, and QA channels.',
      icon: Layers,
      color: 'from-amber-600 to-orange-600',
      bullets: [
        'Dedicated release channels with isolated version histories and tester audiences',
        'Promote verified builds from Beta to Production with a single click',
        'Instant rollback: re-assign the "Latest" pointer to a previous stable build within 1 second',
        'Staged rollout percentage sliders (gradually release to 10%, 25%, 50%, or 100% of testers)',
        'Side-by-side build comparison tool: compare file sizes, permission diffs, and SDK upgrades'
      ]
    },
    {
      id: 'cloud-build',
      tag: 'Developer Velocity',
      title: 'Cloud Build Runners & Official CI/CD Integrations',
      desc: 'Build Android binaries in the cloud without bogging down your local machine, or upload directly from your existing CI pipelines.',
      icon: Terminal,
      color: 'from-pink-600 to-rose-600',
      bullets: [
        'EAS-style isolated Docker build runners with pre-cached Android SDKs and Gradle cache',
        'Official GitHub Actions action (upload-apk-action) for zero-friction continuous delivery',
        'Cross-platform CLI tool: npm i -g shipra for terminal uploads and version queries',
        'Comprehensive REST API with granular scoped access tokens and OpenAPI documentation',
        'Real-time webhooks for build.ready, build.failed, and download events'
      ]
    },
    {
      id: 'teams-analytics',
      tag: 'Observability & Control',
      title: 'Granular Team RBAC, Audit Trails & Real-Time Analytics',
      desc: 'Manage multiple engineering teams and monitor adoption across device models and countries.',
      icon: BarChart3,
      color: 'from-cyan-600 to-blue-600',
      bullets: [
        'Organization workspaces with Owner, Admin, Developer, and Viewer permission tiers',
        'Comprehensive audit log tracking every upload, permission modification, and user invitation',
        'Privacy-friendly IP anonymization adhering to GDPR and Indian DPDP guidelines',
        'Device model breakdowns, Android OS version distribution, and view-to-download conversion metrics',
        'Export all metrics to CSV for stakeholder presentations'
      ]
    }
  ];

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Architecture &amp; Feature Set</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Engineered for Mobile Development Velocity
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            Explore every capability built into the Shipra platform. From automated security sandboxing to team collaboration and cloud builds.
          </p>
        </div>

        {/* Feature Detail Sections (PUB-06) */}
        <div className="space-y-24">
          {featureSections.map((sec, idx) => {
            const Icon = sec.icon;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={sec.id}
                id={sec.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                  !isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`lg:col-span-6 space-y-4 ${!isEven ? 'lg:order-2' : ''}`}>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {sec.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                    {sec.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {sec.desc}
                  </p>

                  <div className="space-y-2.5 pt-3">
                    {sec.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start space-x-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                        <div className="p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`lg:col-span-6 ${!isEven ? 'lg:order-1' : ''}`}>
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${sec.color} text-white flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="w-8 h-8" />
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <span className="text-[10px] text-zinc-400 block mb-1">// Production Verified</span>
                        <p className="text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                          STATUS: 200 OK • Scan: ClamAV / VirusTotal (Clean)
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                        <span className="text-zinc-500">Latency: 18ms</span>
                        <span className="text-emerald-500 font-bold">Cloudflare R2 Edge</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 p-10 rounded-3xl bg-zinc-900 text-white text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold">
            Ready to experience frictionless APK deployment?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Upload your build in 10 seconds and test on real devices immediately.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Link
              href="/dashboard/upload"
              className="px-6 py-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer"
            >
              Upload New Build
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all"
            >
              View Free &amp; Pro Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
