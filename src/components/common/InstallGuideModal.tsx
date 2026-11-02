'use client';

import React from 'react';
import { X, ShieldAlert, Download, Settings, CheckCircle2, AlertTriangle } from "@/components/icons";

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  appName = 'this app'
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      title: 'Download the APK',
      desc: 'Tap the Download APK button on your Android device. Chrome or your browser will begin downloading the file.',
      badge: 'Chrome / Samsung Browser',
      icon: Download
    },
    {
      num: '2',
      title: 'Acknowledge "File might be harmful" prompt',
      desc: 'Google Chrome shows this standard warning for any file downloaded outside the Play Store. Tap "Download anyway". All AppLaunch APKs are pre-scanned with ClamAV and VirusTotal.',
      badge: 'Security Warning',
      icon: AlertTriangle
    },
    {
      num: '3',
      title: 'Allow Installation from Unknown Sources',
      desc: 'When opening the downloaded APK, Android may ask permission: Settings > Turn on "Allow from this source".',
      badge: 'Android Settings',
      icon: Settings
    },
    {
      num: '4',
      title: 'Google Play Protect Verification',
      desc: 'If Google Play Protect displays "Unrecognized App", tap "More details" and select "Install anyway". The app is now ready on your phone!',
      badge: 'Play Protect',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                How to Install on Android
              </h3>
              <p className="text-xs text-zinc-500">Step-by-step instructions for installing {appName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="p-5 overflow-y-auto space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="flex items-start space-x-3.5 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/30">
                  {step.num}
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">
                      {step.title}
                    </h4>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Security Banner */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>
              <strong>Verified Clean:</strong> This package passed automated ClamAV and VirusTotal heuristics scans without any malware detected.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            I Understand, Got It
          </button>
        </div>
      </div>
    </div>
  );
};
