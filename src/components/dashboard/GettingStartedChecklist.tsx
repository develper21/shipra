'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  X, 
  Sparkles, 
  Terminal, 
  UploadCloud, 
  Layers, 
  ShieldCheck, 
  ExternalLink 
} from "@/components/icons";

export const GettingStartedChecklist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDismissed = localStorage.getItem("shipra_checklist_dismissed") === "true";
      setDismissed(isDismissed);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("shipra_checklist_dismissed", "true");
    }
  };

  const handleReopen = () => {
    setDismissed(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("shipra_checklist_dismissed");
    }
  };

  const tasks = [
    {
      id: "provider",
      title: "Connect a source-control provider",
      desc: "Connect GitHub or GitLab to enable automated CI builds",
      completed: true,
      actionText: "Manage Provider",
      actionHref: "/dashboard/settings",
    },
    {
      id: "workspace",
      title: "Set up workspace profile & team",
      desc: "Workspace created with role-based member permissions",
      completed: true,
      actionText: "Team Members",
      actionHref: "/dashboard/members",
    },
    {
      id: "import_project",
      title: "Import or create your first mobile project",
      desc: "Connect a React Native CLI or Expo repository",
      completed: false,
      actionText: "Import Project",
      actionHref: "/dashboard/apps/new",
      isPrimaryNext: true,
    },
    {
      id: "build_target",
      title: "Configure Android build target",
      desc: "Specify compileSdk 35, release keystore, and arm64-v8a ABI",
      completed: false,
      actionText: "Configure",
      actionHref: "/dashboard/settings",
    },
    {
      id: "env_vars",
      title: "Add credentials & environment variables",
      desc: "Store API keys and keystore passwords in encrypted secrets vault",
      completed: false,
      actionText: "Secrets Vault",
      actionHref: "/dashboard/settings",
    },
    {
      id: "first_build",
      title: "Run real build pipeline",
      desc: "Compile React Native / Expo application from resolved Git commit",
      completed: false,
      actionText: "New Build",
      actionHref: "/dashboard/apps/new",
    },
    {
      id: "distribute",
      title: "Distribute to testers or publish to store",
      desc: "Share Android testing link/QR or publish to Google Play / App Store",
      completed: false,
      actionText: "View Releases",
      actionHref: "/dashboard/cloud-build",
    },
  ];

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  if (dismissed) {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleReopen}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Reopen Getting Started Checklist ({completedCount}/{tasks.length})</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/20 dark:from-indigo-950/20 dark:via-zinc-900/70 dark:to-zinc-900/50 shadow-md backdrop-blur-md p-6 sm:p-7 text-left transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-indigo-100 dark:border-indigo-950/80 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                Getting Started with Shipra
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {completedCount} of {tasks.length} Completed
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Complete these steps to set up automated React Native builds and test distributions.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-28 sm:w-36 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg transition-colors cursor-pointer"
            title="Dismiss checklist"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="mt-5 space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              task.isPrimaryNext
                ? "border-indigo-500 bg-white dark:bg-indigo-950/20 shadow-sm ring-1 ring-indigo-500/50"
                : task.completed
                ? "border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-900/30 opacity-80"
                : "border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 shrink-0">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : task.isPrimaryNext ? (
                  <div className="w-5 h-5 rounded-full border-2 border-indigo-600 dark:border-indigo-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-700" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`font-bold text-xs sm:text-sm ${
                      task.completed
                        ? "text-zinc-500 dark:text-zinc-400 line-through"
                        : "text-zinc-900 dark:text-white"
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.isPrimaryNext && (
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                      Recommended Next Step
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {task.desc}
                </p>
              </div>
            </div>

            <div className="shrink-0 pl-8 sm:pl-0">
              <Link
                href={task.actionHref}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  task.isPrimaryNext
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/20"
                    : task.completed
                    ? "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800"
                    : "border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span>{task.actionText}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
