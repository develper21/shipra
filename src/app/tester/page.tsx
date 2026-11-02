'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  Smartphone, 
  Download, 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Check
} from "@/components/icons";

export default function TesterPortalPage() {
  const { apps } = useApp();

  // Feedback modal state (TST-08)
  const [feedbackModalApp, setFeedbackModalApp] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackModalApp(null);
      setFeedbackComment('');
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Tester Portal (TST-06)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
          Apps Shared With Me
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500">
          You have been granted access to test pre-release Android builds. Tap install on your Android device to begin testing.
        </p>
      </div>

      {/* Device Info Card (TST-09) */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs mb-8">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <div>
            <span className="font-semibold text-zinc-900 dark:text-white">Active Device:</span>{' '}
            <span className="text-zinc-500">Android 14 (Pixel / Galaxy S-series detected)</span>
          </div>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">Device Telemetry Active</span>
      </div>

      {/* Apps Shared with Me Cards (TST-06) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app) => {
          const latest = app.builds[0];
          return (
            <div
              key={app.id}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                      {app.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                        {app.name}
                      </h3>
                      <p className="text-xs font-mono text-zinc-400">{app.packageName}</p>
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                        Channel: {latest?.channel || 'Beta'}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    v{latest?.versionName || '1.0.0'}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                  {latest?.releaseNotes || app.shortDescription}
                </p>

                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 text-xs flex justify-between font-mono text-zinc-500">
                  <span>Size: {latest?.fileSizeFormatted || '28 MB'}</span>
                  <span>Min: {latest?.minAndroidVersion || 'Android 8.0'}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setFeedbackModalApp(app.name)}
                  className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 flex items-center space-x-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Submit Bug Feedback (TST-08)</span>
                </button>

                <Link
                  href={`/a/${app.slug}`}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install APK</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* In-App Feedback Modal (TST-08) */}
      {feedbackModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Send QA Feedback for {feedbackModalApp}
            </h3>

            {feedbackSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p>Thank you! Your bug report and device specs were dispatched to the developer.</p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="space-y-4">
                <div>
                  <label className="font-semibold block mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= feedbackRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-300 dark:text-zinc-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Feedback / Bug Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe any crash, UI glitch, or performance feedback..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackModalApp(null)}
                    className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
