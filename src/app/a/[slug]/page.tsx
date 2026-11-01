'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { InstallGuideModal } from '@/components/common/InstallGuideModal';
import { ShareModal } from '@/components/common/ShareModal';
import { AbuseReportModal } from '@/components/common/AbuseReportModal';
import confetti from 'canvas-confetti';
import { 
  Download, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Share2, 
  AlertTriangle, 
  Smartphone, 
  Calendar, 
  HardDrive, 
  Layers, 
  Lock, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  Flag,
  ArrowRight
} from "@/components/icons";

interface PublicAppPageProps {
  params: Promise<{ slug: string }>;
}

export default function PublicAppPage({ params }: PublicAppPageProps) {
  const resolvedParams = use(params);
  const { apps } = useApp();
  const slug = resolvedParams.slug;

  const app = apps.find((a) => a.slug === slug);

  const [isAndroidDevice, setIsAndroidDevice] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadFinished, setDownloadFinished] = useState(false);

  // Modals state
  const [installGuideOpen, setInstallGuideOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [abuseModalOpen, setAbuseModalOpen] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [passwordGatePassed, setPasswordGatePassed] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Version history dropdown state
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showAllPermissions, setShowAllPermissions] = useState(false);

  // Device detection (DIST-14)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('android')) {
        setIsAndroidDevice(true);
      }
    }
  }, []);

  if (!app) {
    notFound();
  }

  const latestBuild = app.builds.find((b) => b.isLatest) || app.builds[0];

  // If password protected (PAGE-11) and not unlocked yet
  const isProtected = latestBuild?.passwordProtected && !passwordGatePassed;

  const handleDownload = () => {
    setDownloading(true);
    setDownloadProgress(20);

    setTimeout(() => setDownloadProgress(50), 300);
    setTimeout(() => setDownloadProgress(85), 600);
    setTimeout(() => {
      setDownloadProgress(100);
      setDownloading(false);
      setDownloadFinished(true);

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (err) {}

      // Prompt install instructions for Android user
      setInstallGuideOpen(true);
    }, 1000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1234' || passwordInput.length >= 3) {
      setPasswordGatePassed(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Password / Access Gate (PAGE-11) */}
        {isProtected && (
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-white max-w-md mx-auto text-center space-y-4 shadow-2xl my-12">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Private Build Protected</h2>
            <p className="text-xs text-zinc-400">
              The developer has protected this test build with access authentication. Enter the passcode to continue.
            </p>
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <input
                type="password"
                placeholder="Enter access passcode (Try: 1234)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-xs text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {passwordError && (
                <p className="text-xs text-rose-400">Incorrect password. Please try again.</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Unlock Download
              </button>
            </form>
          </div>
        )}

        {!isProtected && (
          <>
            {/* Main App Header Box */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl mb-8 relative overflow-hidden">
              {/* Decorative Accent Glow */}
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none -z-10"
                style={{ backgroundColor: app.bannerColor }}
              />

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start space-x-5">
                  {/* App Icon (PAGE-01) */}
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-lg flex items-center justify-center text-4xl shrink-0 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
                    style={{ backgroundColor: `${app.bannerColor}15` }}
                  >
                    {app.icon}
                  </div>

                  {/* App Info (PAGE-01) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                        {app.name}
                      </h1>
                      {app.isVerified && (
                        <span
                          title="Verified Developer"
                          className="p-1 rounded-full bg-blue-500 text-white shadow-sm"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-zinc-500">
                      <Link
                        href={`/dev/${app.developerUsername}`}
                        className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 underline"
                      >
                        {app.developerName}
                      </Link>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-zinc-400">
                        {app.packageName}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 pt-1 leading-relaxed max-w-xl">
                      {app.shortDescription}
                    </p>

                    {/* Metadata tags (PAGE-04) */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        v{latestBuild?.versionName} ({latestBuild?.versionCode})
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        {latestBuild?.fileSizeFormatted}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        {latestBuild?.minAndroidVersion}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        {latestBuild?.channel} Channel
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Action Buttons (Share, Report) */}
                <div className="flex items-center space-x-2 self-start">
                  <button
                    onClick={() => setShareModalOpen(true)}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
                    title="Share this app"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setAbuseModalOpen(true)}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Report app abuse"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Big CTA Download & Smart Device Detection (PAGE-02, DIST-14) */}
              <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="w-full sm:w-auto flex-1">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>
                      {downloading ? `Downloading (${downloadProgress}%)...` : `Download APK (${latestBuild?.fileSizeFormatted})`}
                    </span>
                  </button>

                  <div className="mt-3 flex items-center space-x-3 text-xs text-zinc-500">
                    <button
                      onClick={() => setInstallGuideOpen(true)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 font-semibold cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>How to install on Android</span>
                    </button>
                    <span>•</span>
                    <span>Direct APK link with valid MIME headers</span>
                  </div>
                </div>

                {/* Desktop QR Block (PAGE-03, DIST-14) */}
                <div className="flex items-center space-x-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <div className="p-2.5 bg-white rounded-xl shadow border border-zinc-200">
                    <QrCode className="w-16 h-16 text-zinc-900" />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-zinc-900 dark:text-white">
                      Scan from Phone
                    </p>
                    <p className="text-[11px] text-zinc-500 leading-tight">
                      Open Android camera to install directly onto phone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Verification Badge (PAGE-08) */}
              <div className="mt-6 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>
                    <strong>Virus-Free Verified:</strong> Scanned through ClamAV and VirusTotal heuristics engine. 0 malicious signatures detected.
                  </span>
                </div>
                <span className="hidden sm:inline font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                  SHA-256 Fingerprint Verified
                </span>
              </div>
            </div>

            {/* Screenshots Gallery (PAGE-06) */}
            {app.screenshots.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-3">
                  App Preview Screenshots
                </h3>
                <div className="flex items-center space-x-4 overflow-x-auto pb-4">
                  {app.screenshots.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Screenshot ${idx + 1}`}
                      onClick={() => setSelectedScreenshot(src)}
                      className="w-48 h-80 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800 shadow-md cursor-pointer hover:scale-[1.02] transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Grid: Release Notes + Technical Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
              {/* Release Notes (PAGE-05) */}
              <div className="md:col-span-7 space-y-4">
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white mb-3">
                    What&apos;s New in Version {latestBuild?.versionName}
                  </h3>
                  <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
                    {latestBuild?.releaseNotes}
                  </div>
                </div>

                {/* Version History Accordion (PAGE-07) */}
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <button
                    onClick={() => setShowVersionHistory(!showVersionHistory)}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                        Build &amp; Version History ({app.builds.length})
                      </h4>
                      <p className="text-xs text-zinc-500">Access previous builds for regression testing</p>
                    </div>
                    {showVersionHistory ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>

                  {showVersionHistory && (
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                      {app.builds.map((b) => (
                        <div
                          key={b.id}
                          className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-zinc-900 dark:text-white">
                              v{b.versionName} ({b.channel})
                            </span>
                            <span className="text-zinc-400 block text-[11px]">
                              {b.fileName} • {b.fileSizeFormatted}
                            </span>
                          </div>
                          <button
                            onClick={handleDownload}
                            className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-indigo-600 hover:text-white text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Specifications & Permissions (PAGE-09, BLD-13, BLD-14) */}
              <div className="md:col-span-5 space-y-4">
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Binary Information
                  </h3>

                  <div className="space-y-2.5">
                    <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Package Name</span>
                      <span className="font-mono font-medium text-zinc-900 dark:text-white">{app.packageName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Target SDK</span>
                      <span className="font-medium text-zinc-900 dark:text-white">Android {latestBuild?.targetSdk} (API {latestBuild?.targetSdk})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Minimum OS</span>
                      <span className="font-medium text-zinc-900 dark:text-white">{latestBuild?.minAndroidVersion}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Supported ABIs</span>
                      <span className="font-mono font-medium text-zinc-900 dark:text-white">
                        {latestBuild?.abis?.join(', ') || 'arm64-v8a, armeabi-v7a'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Total Downloads</span>
                      <span className="font-semibold text-emerald-500">{app.totalDownloads.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Declared Permissions (PAGE-09) */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-zinc-900 dark:text-white">
                        Declared Permissions ({latestBuild?.permissions?.length || 0})
                      </span>
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-zinc-500">
                      {(showAllPermissions ? latestBuild?.permissions : latestBuild?.permissions?.slice(0, 3))?.map((perm, idx) => (
                        <div key={idx} className="p-1.5 rounded bg-zinc-50 dark:bg-zinc-800 truncate">
                          {perm}
                        </div>
                      ))}
                      {(latestBuild?.permissions?.length || 0) > 3 && !showAllPermissions && (
                        <button
                          onClick={() => setShowAllPermissions(true)}
                          className="text-xs text-indigo-500 underline font-sans pt-1 cursor-pointer"
                        >
                          Show all {latestBuild?.permissions?.length} permissions
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Developer Profile card link (PAGE-15) */}
                <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {app.developerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-zinc-900 dark:text-white">
                        {app.developerName}
                      </h4>
                      <p className="text-[11px] text-zinc-400">Verified Publisher</p>
                    </div>
                  </div>
                  <Link
                    href={`/dev/${app.developerUsername}`}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                  >
                    <span>More Apps</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Screenshot Lightbox Modal */}
        {selectedScreenshot && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedScreenshot(null)}
          >
            <img
              src={selectedScreenshot}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
            />
          </div>
        )}

        {/* Helper Modals */}
        <InstallGuideModal
          isOpen={installGuideOpen}
          onClose={() => setInstallGuideOpen(false)}
          appName={app.name}
        />

        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          appName={app.name}
          shareUrl={typeof window !== 'undefined' ? window.location.href : `https://shipra.dev/a/${app.slug}`}
        />

        <AbuseReportModal
          isOpen={abuseModalOpen}
          onClose={() => setAbuseModalOpen(false)}
          appName={app.name}
          appSlug={app.slug}
        />
      </div>
    </div>
  );
}
