"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { HelpCircle, Mail, MessageSquare, Shield, CheckCircle2, ArrowRight } from "@/components/icons";

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5" /> Support & Help Desk
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">How Can We Help You?</h1>
          <p className="text-base text-slate-400">
            Have questions about APK distribution, SDK integrations, or billing? Submit a ticket or browse our resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Community Discord</h3>
            <p className="text-xs text-slate-400 mb-4">Real-time troubleshooting with 2,400+ mobile developers.</p>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1"
            >
              Join Server <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <Mail className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Email Support</h3>
            <p className="text-xs text-slate-400 mb-4">Dedicated ticketing with &lt; 4 hour response on Pro/Team.</p>
            <span className="text-xs font-semibold text-indigo-400">support@applaunch.dev</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Trust & Abuse</h3>
            <p className="text-xs text-slate-400 mb-4">Report unauthorized malware or copyright violations.</p>
            <a
              href="/legal/dmca"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1"
            >
              Report DMCA <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">Create Support Ticket</h2>

          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Ticket Submitted Successfully</h3>
              <p className="text-sm text-slate-400">
                Ticket #TICK-8492 has been opened. Our support engineers will follow up at your email address shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Need assistance with APK upload size limits"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue or question in detail..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm transition shadow-lg shadow-blue-500/20"
              >
                {loading ? "Submitting Ticket..." : "Submit Support Ticket"}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
