'use client';

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { 
  Download, 
  QrCode, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Copy,
  Check,
  ArrowRight
} from "@/components/icons";
import { DistributionRecord } from "@/types";

export default function AndroidTesterLandingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  const [downloadCount, setDownloadCount] = useState(12);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    setDownloadStarted(true);
    setDownloadCount((prev) => prev + 1);
    // Trigger download of APK
    alert("Starting APK download with proper MIME headers: application/vnd.android.package-archive");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/shipara.svg" alt="Shipra" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-white">
              Shipra
            </span>
          </Link>

          <div className="flex items-center space-x-2 text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Tester Distribution Mode</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6 text-left">
          {/* App Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                📱
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                  Pulse Fitness Mobile
                </h1>
                <span className="text-xs font-mono text-zinc-400">
                  com.developer.pulsefitness &bull; v2.5.0 (#250)
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Verified
            </span>
          </div>

          {/* Security & Verification Badge */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Scanned Clean (0 threats detected by ClamAV)</span>
            </div>
            <span className="font-mono text-[10px] text-zinc-400">SHA-256 Verified</span>
          </div>

          {/* Action: 1-Tap Download Button */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-3.5 rounded-2xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download APK (32.4 MB)</span>
            </button>

            <div className="flex items-center justify-between text-xs text-zinc-400 px-1 pt-1">
              <span>{downloadCount} downloads recorded</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          {/* QR Code for Desktop Visitors */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-4">
            <div className="w-20 h-20 bg-white p-2 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-center shrink-0">
              <QrCode className="w-16 h-16 text-zinc-900" />
            </div>
            <div className="space-y-1 text-xs">
              <span className="font-bold text-zinc-900 dark:text-white block">
                Testing on Android?
              </span>
              <p className="text-zinc-500 dark:text-zinc-400 leading-normal">
                Point your phone camera at this QR code to download and install this build directly.
              </p>
            </div>
          </div>

          {/* Android Installation Guidance Notice (Page 17) */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 space-y-1.5">
            <span className="font-bold flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Android Install Instructions:</span>
            </span>
            <ol className="list-decimal pl-4 space-y-1 text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <li>When downloaded, Android may show &ldquo;File might be harmful&rdquo;. Tap <strong>Download anyway</strong>.</li>
              <li>Open the downloaded APK and tap <strong>Settings &rarr; Allow from this source</strong>.</li>
              <li>Tap <strong>Install</strong> to complete installation.</li>
            </ol>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-zinc-400 border-t border-zinc-200 dark:border-zinc-800">
        <span>Powered by Shipra Mobile Release Orchestration</span>
      </footer>
    </div>
  );
}
