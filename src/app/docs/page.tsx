"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import {
  BookOpen,
  Search,
  Terminal,
  Shield,
  Layers,
  ArrowRight,
  GitBranch,
  FileCode,
  Zap,
} from "@/components/icons";

const DOCS_SECTIONS = [
  {
    category: "Getting Started",
    icon: Zap,
    items: [
      {
        slug: "quickstart",
        title: "Quickstart Guide",
        desc: "Deploy your first APK in 60 seconds with 0 configuration.",
      },
      {
        slug: "architecture",
        title: "System Architecture",
        desc: "Deep dive into Cloudflare R2, PostgreSQL, and streaming downloads.",
      },
    ],
  },
  {
    category: "CLI & Integrations",
    icon: Terminal,
    items: [
      {
        slug: "cli-reference",
        title: "Shipra CLI",
        desc: "Authenticate, upload builds, and query distribution channels from bash.",
      },
      {
        slug: "ci-cd-integration",
        title: "GitHub Actions & Fastlane",
        desc: "Drop-in workflow snippets for automated APK publishing on git push.",
      },
      {
        slug: "in-app-updates",
        title: "In-App Updates SDK",
        desc: "Prompt users for immediate or flexible updates right inside your Android app.",
      },
    ],
  },
  {
    category: "Safety & Distribution",
    icon: Shield,
    items: [
      {
        slug: "security-scanning",
        title: "Antivirus Pipeline",
        desc: "Automated ClamAV virus detection, SHA256 hashes, and VirusTotal checks.",
      },
      {
        slug: "channels-rollouts",
        title: "Channels & Staged Rollouts",
        desc: "Managing Production, Beta, and Internal channels with percentage rollouts.",
      },
      {
        slug: "webhooks",
        title: "Webhooks & Event API",
        desc: "Signed HMAC payloads for build.ready, download.event, and tester feedback.",
      },
    ],
  },
];

export default function DocsPage() {
  const [search, setSearch] = useState("");

  const filteredSections = DOCS_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" /> Documentation & Developer Guides
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Learn How to Build & Distribute on Shipra
          </h1>
          <p className="text-lg text-slate-400">
            Explore guides, reference materials, CLI documentation, and SDK tutorials for effortless Android APK distribution.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides, CLI commands, and SDK methods..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xl"
            />
          </div>
        </div>

        {/* Quick Links Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link
            href="/docs/quickstart"
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 to-slate-900/50 border border-blue-500/30 hover:border-blue-500/60 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Quickstart in 60s</h3>
            <p className="text-sm text-slate-400">Upload your first APK and generate a shareable QR link instantly.</p>
          </Link>

          <Link
            href="/docs/cli-reference"
            className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-slate-900/50 border border-indigo-500/30 hover:border-indigo-500/60 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Shipra CLI</h3>
            <p className="text-sm text-slate-400">Automate your CI build uploads using `npx shipra upload`.</p>
          </Link>

          <Link
            href="/docs/in-app-updates"
            className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/30 to-slate-900/50 border border-cyan-500/30 hover:border-cyan-500/60 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">In-App Update SDK</h3>
            <p className="text-sm text-slate-400">Native Android update dialogs for React Native and Flutter apps.</p>
          </Link>
        </div>

        {/* Categories Sections */}
        <div className="space-y-12">
          {filteredSections.map((sec) => (
            <div key={sec.category}>
              <div className="flex items-center gap-3 mb-6">
                <sec.icon className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">{sec.category}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sec.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/docs/${item.slug}`}
                    className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition flex flex-col justify-between group"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-400">
                      Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
