'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertOctagon } from "@/components/icons";

interface AbuseReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  appSlug: string;
}

export const AbuseReportModal: React.FC<AbuseReportModalProps> = ({
  isOpen,
  onClose,
  appName,
  appSlug
}) => {
  const [reason, setReason] = useState('Malware / Virus');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // simulate completed report
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-rose-50 dark:bg-rose-950/20">
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
            <AlertOctagon className="w-5 h-5" />
            <h3 className="font-bold text-base">Report Application</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                Report Submitted to Moderation Team
              </h4>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                Thank you for keeping the ecosystem safe. Our automated quarantine engine and security team have logged this flag for immediate human review within 30 minutes.
              </p>
            </div>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <p className="text-zinc-600 dark:text-zinc-400">
              Reporting build package for <strong className="text-zinc-900 dark:text-white">{appName}</strong> (<code className="font-mono">/a/{appSlug}</code>).
            </p>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Reason for report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Malware / Virus">Malware / Trojan / Spyware</option>
                <option value="Phishing / Impersonation">Phishing or Banking App Impersonation</option>
                <option value="Copyright Violation">Copyright or Trademark Infringement</option>
                <option value="Dangerous Permissions">Abusive Permissions or Data Harvesting</option>
                <option value="Other">Other Policy Violation</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Details & Evidence
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe what this APK does or provide screenshot/proof links..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Your Contact Email (optional for status updates)
              </label>
              <input
                type="email"
                placeholder="security-researcher@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Submit Abuse Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
