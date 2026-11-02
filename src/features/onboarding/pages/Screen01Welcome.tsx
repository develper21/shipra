import React from "react";
import { Rocket, ShieldCheck, QrCode, Smartphone, Sparkles, CheckCircle2 } from "@/components/icons";

interface Screen01WelcomeProps {
  onStart: () => void;
  onLater: () => void;
}

export const Screen01Welcome: React.FC<Screen01WelcomeProps> = ({ onStart, onLater }) => {
  return (
    <div className="space-y-8 text-left">
      {/* Top Badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Welcome to Shipra</span>
      </div>

      {/* Main Headline & Explanatory Copy */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
          Your mobile releases, in one workspace.
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          Shipra helps engineering teams and solo builders manage React Native &amp; mobile build
          and deployment workflows without store review delays, per-seat paywalls, or restrictive queues.
        </p>
      </div>

      {/* 3 Concise Capabilities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2.5 hover:border-indigo-500/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
            Connect Mobile Projects
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Import React Native CLI, Expo EAS, or Flutter repositories seamlessly.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2.5 hover:border-indigo-500/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
            Auto-Scanned Builds
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Every APK binary is scanned through dual ClamAV and VirusTotal security engines.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2.5 hover:border-indigo-500/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
            Instant 1-Tap Installs
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Smart device detection generates instant QR codes and permanent /latest URLs.
          </p>
        </div>
      </div>

      {/* Privacy & Trust Note */}
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 flex items-start space-x-3 text-xs text-zinc-500 dark:text-zinc-400">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <span>
          <strong>Privacy first:</strong> We only request minimal read-only permissions when you connect
          code providers. Your source code and APK binaries remain completely private and under your control.
        </span>
      </div>
    </div>
  );
};
