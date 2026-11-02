import React from "react";
import { 
  CheckCircle2, 
  Sparkles, 
  Building, 
  Github, 
  Folder, 
  Users, 
  ArrowRight, 
  Rocket 
} from "@/components/icons";

interface Screen07CompleteProps {
  workspaceName: string;
  workspaceSlug: string;
  providerConnected: boolean;
  providerName?: string;
  startingPointType?: "import" | "dashboard";
  selectedRepo?: string;
  inviteCount: number;
}

export const Screen07Complete: React.FC<Screen07CompleteProps> = ({
  workspaceName,
  workspaceSlug,
  providerConnected,
  providerName = "GitHub",
  startingPointType = "dashboard",
  selectedRepo,
  inviteCount,
}) => {
  const hasRepo = startingPointType === "import" && selectedRepo;

  return (
    <div className="space-y-8 text-left">
      {/* Success Badge & Header */}
      <div className="space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Your workspace is ready!
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          We&apos;ve configured your workspace environment. Here is a summary of what was prepared:
        </p>
      </div>

      {/* Setup Summary Card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800 text-xs sm:text-sm">
        {/* Workspace */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-zinc-900 dark:text-white block">
                {workspaceName}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                shipra.dev/{workspaceSlug}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Created &bull; Owner
          </span>
        </div>

        {/* Source Provider */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-bold">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-zinc-900 dark:text-white block">
                Source Code Provider
              </span>
              <span className="text-[11px] text-zinc-400">
                {providerConnected ? `Connected via ${providerName}` : "Skipped for now (can connect later)"}
              </span>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            providerConnected
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
          }`}>
            {providerConnected ? "Connected" : "Optional"}
          </span>
        </div>

        {/* Starting Point */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-bold">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-zinc-900 dark:text-white block">
                Starting Mode
              </span>
              <span className="text-[11px] text-zinc-400">
                {hasRepo ? `Selected repository: ${selectedRepo}` : "Start from workspace dashboard"}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            {hasRepo ? "Project Draft" : "Dashboard Ready"}
          </span>
        </div>

        {/* Team Invitations */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-zinc-900 dark:text-white block">
                Collaborators
              </span>
              <span className="text-[11px] text-zinc-400">
                {inviteCount > 0 ? `${inviteCount} teammate invitations queued` : "Solo developer setup"}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            {inviteCount > 0 ? `${inviteCount} Invites` : "Solo Mode"}
          </span>
        </div>
      </div>

      {/* Recommended Next Step Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200 dark:border-indigo-900/40 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Recommended Next Action
          </span>
          <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
            {hasRepo
              ? "Configure your first project and release profile"
              : "Explore the dashboard and upload your first Android APK"}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Your first-run checklist will guide you step-by-step.
          </p>
        </div>
      </div>
    </div>
  );
};
