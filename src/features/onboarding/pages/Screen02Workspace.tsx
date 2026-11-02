import React, { useState } from "react";
import { Check, CheckCircle2, AlertCircle, Building, Globe, User } from "@/components/icons";

interface Screen02WorkspaceProps {
  fullName: string;
  workspaceName: string;
  workspaceSlug: string;
  companyName: string;
  onChangeFullName: (v: string) => void;
  onChangeWorkspaceName: (v: string) => void;
  onChangeWorkspaceSlug: (v: string) => void;
  onChangeCompanyName: (v: string) => void;
  error?: string;
}

export const Screen02Workspace: React.FC<Screen02WorkspaceProps> = ({
  fullName,
  workspaceName,
  workspaceSlug,
  companyName,
  onChangeFullName,
  onChangeWorkspaceName,
  onChangeWorkspaceSlug,
  onChangeCompanyName,
  error,
}) => {
  const [showJoinOption, setShowJoinOption] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [slugModified, setSlugModified] = useState(false);

  // Auto slugify when workspace name changes (if user hasn't manually overridden slug)
  const handleWorkspaceNameChange = (val: string) => {
    onChangeWorkspaceName(val);
    if (!slugModified) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      onChangeWorkspaceSlug(generatedSlug || "my-workspace");
    }
  };

  const handleSlugChange = (val: string) => {
    setSlugModified(true);
    onChangeWorkspaceSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
    );
  };

  const isSlugValid = /^[a-z0-9-]+$/.test(workspaceSlug) && workspaceSlug.length >= 3;

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Create your workspace
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Workspaces organize your mobile projects, builds, team members, and integration tokens. You can rename it anytime.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Your Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => onChangeFullName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all"
            />
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Displayed on shared release notes and team activity logs.
          </p>
        </div>

        {/* Workspace Name */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Workspace Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={workspaceName}
            onChange={(e) => handleWorkspaceNameChange(e.target.value)}
            placeholder="e.g. Acme Mobile or Alex's Projects"
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all"
          />
        </div>

        {/* Workspace URL / Slug */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Workspace URL Slug <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white dark:focus-within:bg-zinc-900">
            <span className="px-3 text-xs font-mono text-zinc-400 select-none bg-zinc-100 dark:bg-zinc-900/80 border-r border-zinc-200 dark:border-zinc-800 py-2.5">
              shipra.dev/
            </span>
            <input
              type="text"
              required
              value={workspaceSlug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="acme-mobile"
              className="w-full px-3 py-2 text-xs sm:text-sm font-mono text-indigo-600 dark:text-indigo-400 bg-transparent focus:outline-none"
            />
            <div className="pr-3">
              {isSlugValid ? (
                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Available</span>
                </span>
              ) : (
                <span className="text-[11px] text-amber-500">Min 3 chars</span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Lowercase letters, numbers, and hyphens only.
          </p>
        </div>

        {/* Company Name (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Organization or Studio Name <span className="text-zinc-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => onChangeCompanyName(e.target.value)}
            placeholder="e.g. Acme Studio LLC (optional for solo devs)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all"
          />
        </div>
      </div>

      {/* Join Existing Workspace Alternative */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
        {!showJoinOption ? (
          <button
            type="button"
            onClick={() => setShowJoinOption(true)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Have an invite token? Join an existing workspace instead &rarr;
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-xs font-semibold text-zinc-900 dark:text-white">
              Enter Workspace Invitation Token
            </span>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Paste token e.g. inv_tok_..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  if (inviteCode) {
                    window.location.href = `/invite/${inviteCode}`;
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Join
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
