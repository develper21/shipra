'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, ShieldCheck, CheckCircle2, Send, HelpCircle } from "@/components/icons";

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaAnswer.trim() !== '7') {
      setError('Anti-spam verification failed. What is 3 + 4?');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
          Support &amp; Inquiries
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Contact Our Team
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Need help with self-hosting, enterprise team limits, security disclosures, or feature requests? We respond within 4 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Contact Info Side */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
              Direct Channels
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>support@shipra.dev</span>
              </div>
              <div className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>security@shipra.dev (Fast Takedown)</span>
              </div>
              <div className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400">
                <MessageSquare className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Discord: discord.gg/shipra</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-2 text-indigo-900 dark:text-indigo-200">
            <p className="font-semibold flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>Looking for Quick Answers?</span>
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Check out our comprehensive <a href="/docs" className="text-indigo-600 dark:text-indigo-400 underline font-medium">Documentation Site</a> for step-by-step guides on Expo, React Native, and Flutter deployments.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="md:col-span-7">
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out, {name}. Our engineering support team has received your ticket and will follow up shortly at {email}.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                    setCaptchaAnswer('');
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="developer@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Topic / Category
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="General Inquiry">General Developer Inquiry</option>
                    <option value="Bug / Technical Support">Bug / Technical Support</option>
                    <option value="Billing & Plans">Billing, Invoices &amp; India GST</option>
                    <option value="Security / Malware Report">Security / False Positive Scan</option>
                    <option value="Enterprise / Self-Host">Enterprise Custom SLA / Self-Host</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help your team?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Anti-spam protection (PUB-10) */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Spam Verification: What is 3 + 4?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter number..."
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    className="w-32 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Support Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
