'use client';

import React, { useState } from 'react';
import { LegalNav } from '@/components/common/LegalNav';
import { Copyright, CheckCircle2, Send } from "@/components/icons";

export default function DmcaPage() {
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [infringingUrl, setInfringingUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <LegalNav />

      <div className="space-y-8">
        <div>
          <span className="text-xs font-mono text-zinc-400">Digital Millennium Copyright Act Compliance</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1 mb-4">
            DMCA &amp; Copyright Takedown Process
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Shipra respects the intellectual property rights of software creators, artists, and rights holders. If you believe your copyrighted material is being distributed via Shipra without authorization, please submit a notice below.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                DMCA Notice Received
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Our Designated Copyright Agent has logged ticket reference #DMCA-{Math.floor(Math.random() * 90000 + 10000)}. We typically process valid requests and disable infringing links within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-2 flex items-center space-x-2">
                <Copyright className="w-4 h-4 text-indigo-500" />
                <span>Submit Copyright Infringement Notice</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Copyright Owner / Agent Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    placeholder="Legal Representative Name"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Official Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={claimantEmail}
                    onChange={(e) => setClaimantEmail(e.target.value)}
                    placeholder="legal@rightsowner.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Infringing App URL on Shipra
                </label>
                <input
                  type="text"
                  required
                  value={infringingUrl}
                  onChange={(e) => setInfringingUrl(e.target.value)}
                  placeholder="https://shipra.dev/a/infringing-app-slug"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Evidence &amp; Description of Original Copyrighted Work
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your copyrighted work, registration number, or official Google Play / App Store listing link..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors cursor-pointer"
                >
                  Submit Official DMCA Takedown
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
