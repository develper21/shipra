'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Rocket, MessageSquare, Check, Shield, Activity } from "@/components/icons";
import { GithubIcon, TwitterIcon } from '@/components/common/BrandIcons';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand & Newsletter (2 columns) */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <img
                src="/shipara.svg"
                alt="Shipra"
                className="w-8 h-8 rounded-lg shadow-md object-contain"
              />
              <span className="font-bold text-lg text-zinc-900 dark:text-white">Shipra</span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Open-source, framework-agnostic Android APK distribution platform. Deploy builds from Expo, React Native, Flutter, and native Android without limits or arbitrary paywalls.
            </p>

            {/* Newsletter (PUB-19) */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 block mb-2">
                Stay updated with release notifications
              </span>
              {newsletterSubscribed ? (
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-medium py-1.5">
                  <Check className="w-4 h-4" />
                  <span>Subscribed! We will notify you when new release tools drop.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                  <input
                    type="email"
                    required
                    placeholder="developer@company.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Live Uptime Badge (PUB-11) */}
            <div className="pt-3 flex items-center space-x-3">
              <Link
                href="/status"
                className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All Systems Operational (99.98%)</span>
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Features Overview
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/use-cases" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Use Cases
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center space-x-1">
                  <span>System Status</span>
                  <Activity className="w-3 h-3 text-emerald-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Developers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Documentation Site
                </Link>
              </li>
              <li>
                <Link href="/docs/expo-react-native" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Expo & React Native Guide
                </Link>
              </li>
              <li>
                <Link href="/docs/flutter" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Flutter Deployment Guide
                </Link>
              </li>
              <li>
                <Link href="/docs/api-reference" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  REST API & CLI Reference
                </Link>
              </li>
              <li>
                <Link href="/tester" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Tester Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-zinc-900 dark:hover:text-white transition-colors text-amber-500">
                  Internal Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/legal/terms" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Privacy Policy (GDPR / DPDP)
                </Link>
              </li>
              <li>
                <Link href="/legal/aup" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Acceptable Use Policy (AUP)
                </Link>
              </li>
              <li>
                <Link href="/legal/dmca" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  DMCA Copyright Takedown
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/refund" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  About Us & Security
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span>© 2026 Shipra (Open Source Mobile App Distribution). Apache 2.0 license.</span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
