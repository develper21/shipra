'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BuildJobRecord } from "@/types";
import { 
  Terminal, 
  GitBranch, 
  GitCommit, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Download, 
  Plus, 
  Share2, 
  Smartphone, 
  Rocket,
  ArrowRight
} from "@/components/icons";

export default function BuildPipelinesListPage() {
  const [builds, setBuilds] = useState<BuildJobRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const res = await fetch("/api/v1/real-builds");
        const data = await res.json();
        if (data.success && data.builds) {
          setBuilds(data.builds);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuilds();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto text-left">
        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>Real Build &amp; Release Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Build Pipelines &amp; Releases
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
              Truthful compilation from Git commits. Monitor real pipeline stages, live worker logs, artifact validation, and release choices.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/apps/new"
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Build Pipeline</span>
            </Link>
          </div>
        </div>

        {/* Core Product Distinction Callout (Page 1-3 & 16 of Blueprint) */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-zinc-900 dark:text-white">Core Principle:</span>
            <span>
              <strong>Build</strong> &ne; <strong>Distribution</strong> &ne; <strong>Publishing</strong>. Builds compile signed binaries; distribution provides tester links; publishing submits to Google Play/App Store.
            </span>
          </div>
          <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 shrink-0 font-semibold">
            Separated Lifecycle
          </span>
        </div>

        {/* Builds List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Recent Build Executions ({builds.length})
            </h2>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs text-zinc-500">Fetching build records...</p>
            </div>
          ) : builds.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 space-y-3">
              <Terminal className="w-8 h-8 text-zinc-400 mx-auto" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">No builds yet</h3>
              <p className="text-xs text-zinc-500">Connect a Git repository and start your first real build pipeline.</p>
              <Link
                href="/dashboard/apps/new"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Build</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {builds.map((job) => {
                const isSuccess = job.status === "success";
                return (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2.5">
                          <Link
                            href={`/dashboard/builds/${job.id}`}
                            className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            {job.projectName}
                          </Link>
                          <span className="font-mono text-xs text-zinc-400">
                            #{job.id}
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {job.platform} &bull; {job.profile}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                          <span className="flex items-center space-x-1 font-mono">
                            <GitBranch className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{job.branch}</span>
                          </span>
                          <span className="flex items-center space-x-1 font-mono">
                            <GitCommit className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{job.commitSha}</span>
                          </span>
                          <span className="truncate max-w-xs">{job.commitMessage}</span>
                          {job.durationFormatted && (
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{job.durationFormatted}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            isSuccess
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                              : job.status === "failed"
                              ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                              : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 animate-pulse"
                          }`}
                        >
                          {job.status}
                        </span>

                        <Link
                          href={`/dashboard/builds/${job.id}`}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center space-x-1"
                        >
                          <span>View Pipeline</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Stage & Progress Bar */}
                    <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>Current Stage: <strong className="text-zinc-800 dark:text-zinc-200">{job.currentStage}</strong></span>
                        <span className="font-mono">{job.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isSuccess ? "bg-emerald-500" : "bg-indigo-600"
                          }`}
                          style={{ width: `${job.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
