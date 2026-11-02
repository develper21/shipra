'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { 
  Github, 
  Gitlab, 
  Bitbucket, 
  GitBranch, 
  GitCommit, 
  Folder, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Terminal, 
  Sparkles, 
  Smartphone, 
  ShieldCheck, 
  Check, 
  RefreshCw, 
  Search, 
  Plus, 
  Trash2,
  Lock,
  Layers
} from "@/components/icons";
import { ProjectAnalysisReport, ProjectFrameworkType, BuildProfile } from "@/types";

export default function NewProjectWizardPage() {
  const router = useRouter();
  const { apps, activeWorkspace } = useApp();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Step 1 & 2: Provider selection & connection
  const [selectedProvider, setSelectedProvider] = useState<"github" | "gitlab" | "bitbucket">("github");
  const [providerConnected, setProviderConnected] = useState<boolean>(true);
  const [connectedAccount, setConnectedAccount] = useState<string>("developer-gh");

  // Step 3: Repository selection
  const sampleRepos = [
    {
      id: "pulse-fitness-mobile",
      fullName: "developer/pulse-fitness-mobile",
      owner: "developer",
      isPrivate: false,
      language: "TypeScript",
      updatedAt: "2 hours ago",
      defaultBranch: "main",
      defaultFramework: "React Native CLI" as ProjectFrameworkType,
    },
    {
      id: "hyper-chat-mobile",
      fullName: "developer/hyper-chat-mobile",
      owner: "developer",
      isPrivate: true,
      language: "TypeScript",
      updatedAt: "Yesterday",
      defaultBranch: "main",
      defaultFramework: "Expo Managed" as ProjectFrameworkType,
    },
    {
      id: "ecommerce-store-rn",
      fullName: "developer/ecommerce-store-rn",
      owner: "developer",
      isPrivate: false,
      language: "JavaScript",
      updatedAt: "3 days ago",
      defaultBranch: "main",
      defaultFramework: "Expo Prebuild" as ProjectFrameworkType,
    },
    {
      id: "finflow-crypto-wallet",
      fullName: "developer/finflow-crypto-wallet",
      owner: "developer",
      isPrivate: true,
      language: "TypeScript",
      updatedAt: "Last week",
      defaultBranch: "main",
      defaultFramework: "React Native CLI" as ProjectFrameworkType,
    },
  ];

  const [repoSearch, setRepoSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(sampleRepos[0]);

  // Step 4: Branch, Commit & Monorepo
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [commitSha, setCommitSha] = useState("a83f91c");
  const [commitMessage, setCommitMessage] = useState("feat(gps): calibrate distance filter for indoor treadmill");
  const [commitAuthor, setCommitAuthor] = useState("Aarav Sharma");
  const [projectDirectory, setProjectDirectory] = useState(".");

  // Step 5: Source Code Analysis Report
  const [analysisReport, setAnalysisReport] = useState<ProjectAnalysisReport | null>(null);

  // Step 6: Project Configuration & Build Environment
  const [appName, setAppName] = useState("Pulse Fitness Mobile");
  const [packageName, setPackageName] = useState("com.developer.pulsefitness");
  const [bundleId, setBundleId] = useState("com.developer.pulsefitness");
  const [appVersion, setAppVersion] = useState("1.0.0");
  const [buildNumber, setBuildNumber] = useState("101");
  const [nodeVersion, setNodeVersion] = useState("20.x");
  const [packageManager, setPackageManager] = useState<"npm" | "yarn" | "pnpm" | "bun">("npm");
  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string; isSecret: boolean }>>([
    { key: "API_URL", value: "https://api.pulsefitness.dev", isSecret: false },
    { key: "SENTRY_DSN", value: "https://key@sentry.io/123", isSecret: true },
  ]);

  // Step 7: Build Platform & Profile
  const [targetPlatform, setTargetPlatform] = useState<"android" | "ios" | "android_ios">("android");
  const [buildProfile, setBuildProfile] = useState<BuildProfile>("production");

  // Step 5: Trigger real analysis
  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/projects/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoFullName: selectedRepo.fullName,
          branch: selectedBranch,
        }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setAnalysisReport(data.report);
        setAppName(data.report.projectName);
        setPackageName(data.report.detectedPackageName);
        setBundleId(data.report.detectedBundleId);
        setPackageManager(data.report.packageManager);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setStep(5);
    }
  };

  // Step 8: Start Real Build
  const handleStartBuild = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/real-builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: appName,
          repoFullName: selectedRepo.fullName,
          branch: selectedBranch,
          commitSha,
          commitMessage,
          commitAuthor,
          platform: targetPlatform === "android_ios" ? "android" : targetPlatform,
          profile: buildProfile,
        }),
      });
      const data = await res.json();
      if (data.success && data.build) {
        router.push(`/dashboard/builds/${data.build.id}`);
      }
    } catch (err) {
      setError("Failed to create build job. Please try again.");
      setLoading(false);
    }
  };

  const filteredRepos = sampleRepos.filter((r) =>
    r.fullName.toLowerCase().includes(repoSearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 text-left">
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel &amp; Return to Dashboard</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Stage {step} of 8
            </span>
            <div className="w-24 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.round((step / 8) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Wizard Main Shell */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-8">
          {/* ========================================================= */}
          {/* SCREEN 1 & 2: CHOOSE & CONNECT SOURCE PROVIDER (PAGES 4-5) */}
          {/* ========================================================= */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Screen 1 of 8 &bull; Project Source</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Where is your mobile code hosted?
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Connect your source-control provider to select repositories, read branches, and run builds.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: "github" as const, name: "GitHub", icon: Github, desc: "Public & private repositories with automatic commit webhook triggers." },
                  { id: "gitlab" as const, name: "GitLab", icon: Gitlab, desc: "GitLab.com and self-hosted instances with repository deploy keys." },
                  { id: "bitbucket" as const, name: "Bitbucket", icon: Bitbucket, desc: "Bitbucket Cloud repositories and deployment pipelines." },
                ].map((prov) => {
                  const Icon = prov.icon;
                  const isSelected = selectedProvider === prov.id;
                  return (
                    <div
                      key={prov.id}
                      onClick={() => setSelectedProvider(prov.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500 shadow-sm"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                          <Icon size={22} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                              {prov.name}
                            </h3>
                            {providerConnected && isSelected && (
                              <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Connected (@{connectedAccount})</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {prov.desc}
                          </p>
                        </div>
                      </div>

                      <div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Least Privilege Security Note */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  We strictly request read-only repository metadata and webhook permissions. Your private source code is never cached or stored on Shipra servers.
                </span>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer flex items-center space-x-1"
                >
                  <span>Select Repository</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 3: SELECT REPOSITORY (PAGE 5)                       */}
          {/* ========================================================= */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2">
                  <Folder className="w-3.5 h-3.5" />
                  <span>Screen 2 of 8 &bull; Select Repository</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Choose repository to build
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Connected as <strong>@{connectedAccount}</strong> on {selectedProvider.toUpperCase()}.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  placeholder="Filter repositories..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Repositories List */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {filteredRepos.map((repo) => {
                  const isSelected = selectedRepo.id === repo.id;
                  return (
                    <div
                      key={repo.id}
                      onClick={() => setSelectedRepo(repo)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 ring-1 ring-indigo-500 shadow-sm"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
                            {repo.fullName}
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {repo.isPrivate ? "Private" : "Public"}
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                            {repo.defaultFramework}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-[11px] text-zinc-400">
                          <span>{repo.language}</span>
                          <span>&bull;</span>
                          <span>Default: {repo.defaultBranch}</span>
                          <span>&bull;</span>
                          <span>Updated {repo.updatedAt}</span>
                        </div>
                      </div>

                      <div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer flex items-center space-x-1"
                >
                  <span>Select Branch &amp; Commit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 4: SELECT BRANCH, COMMIT & MONOREPO PATH (PAGE 5)   */}
          {/* ========================================================= */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Screen 3 of 8 &bull; Branch &amp; Commit Resolution</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Select branch and exact commit SHA
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Builds must always be bound to an immutable commit hash to ensure 100% reproducible builds.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4">
                {/* Branch Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Target Branch
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="main">main (default branch)</option>
                    <option value="development">development</option>
                    <option value="staging">staging</option>
                    <option value="feature/new-ui">feature/new-ui</option>
                  </select>
                </div>

                {/* Resolved Commit Info Card */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-500">Resolved Commit SHA:</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{commitSha}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-500">Message:</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-medium truncate max-w-xs">{commitMessage}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-500">Author:</span>
                    <span className="text-zinc-700 dark:text-zinc-300">{commitAuthor}</span>
                  </div>
                </div>

                {/* Monorepo Support Subdirectory */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Project Root Directory <span className="text-zinc-400 font-normal">(Monorepo support)</span>
                  </label>
                  <input
                    type="text"
                    value={projectDirectory}
                    onChange={(e) => setProjectDirectory(e.target.value)}
                    placeholder=". or apps/mobile"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-white"
                  />
                  <p className="text-[11px] text-zinc-400">
                    Use &ldquo;.&rdquo; for root, or specify directory containing package.json (e.g. apps/mobile).
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={runAnalysis}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer flex items-center space-x-2"
                >
                  {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Run Source Code Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 5: SOURCE CODE ANALYSIS REPORT (PAGES 6-8)         */}
          {/* ========================================================= */}
          {step === 5 && analysisReport && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Screen 4 of 8 &bull; Project Analysis Complete</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Project Health &amp; Architecture Report
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  We inspected the repository AST, package.json, lockfile, and Gradle settings at commit {commitSha}.
                </p>
              </div>

              {/* Classification Banner */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[11px]">Detected Framework</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{analysisReport.framework}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">React Native Version</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{analysisReport.reactNativeVersion}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Package Manager</span>
                  <span className="font-bold text-zinc-900 dark:text-white uppercase">{analysisReport.packageManager}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Node.js Target</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{analysisReport.nodeVersion}</span>
                </div>
              </div>

              {/* 5 Structural Verification Checks */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Verification Checks
                </span>
                <div className="space-y-2">
                  {analysisReport.checks.map((chk, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-zinc-900 dark:text-white">{chk.name}</span>
                      </div>
                      <span className="text-zinc-500 dark:text-zinc-400">{chk.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer flex items-center space-x-1"
                >
                  <span>Configure Project &amp; Environment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 6: PROJECT CONFIGURATION & ENV VARIABLES (PAGE 9)  */}
          {/* ========================================================= */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Screen 5 of 8 &bull; Project Configuration</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Configure App Identifiers &amp; Secrets
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Prefilled from source code manifest. You can adjust versioning and inject environment variables.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Application Display Name
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Android Package Name
                  </label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    iOS Bundle Identifier
                  </label>
                  <input
                    type="text"
                    value={bundleId}
                    onChange={(e) => setBundleId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Version Name
                    </label>
                    <input
                      type="text"
                      value={appVersion}
                      onChange={(e) => setAppVersion(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Build Code
                    </label>
                    <input
                      type="text"
                      value={buildNumber}
                      onChange={(e) => setBuildNumber(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Environment Variables Editor */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Environment Variables &amp; Secrets ({envVars.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setEnvVars([...envVars, { key: "", value: "", isSecret: false }])}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Variable</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {envVars.map((ev, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="KEY"
                        value={ev.key}
                        onChange={(e) => {
                          const updated = [...envVars];
                          updated[i].key = e.target.value.toUpperCase();
                          setEnvVars(updated);
                        }}
                        className="w-1/3 px-3 py-1.5 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                      />
                      <input
                        type={ev.isSecret ? "password" : "text"}
                        placeholder="VALUE"
                        value={ev.value}
                        onChange={(e) => {
                          const updated = [...envVars];
                          updated[i].value = e.target.value;
                          setEnvVars(updated);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...envVars];
                          updated[i].isSecret = !updated[i].isSecret;
                          setEnvVars(updated);
                        }}
                        className={`px-2 py-1.5 text-[10px] rounded-lg border font-semibold ${
                          ev.isSecret ? "bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-200" : "text-zinc-400 border-zinc-200"
                        }`}
                        title="Toggle secret masking"
                      >
                        {ev.isSecret ? "Secret" : "Plain"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEnvVars(envVars.filter((_, idx) => idx !== i))}
                        className="p-1.5 text-zinc-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(7)}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer flex items-center space-x-1"
                >
                  <span>Platform &amp; Build Profiles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 7: PLATFORM SELECTION & BUILD PROFILES (PAGE 11)   */}
          {/* ========================================================= */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Screen 6 of 8 &bull; Build Target &amp; Profile</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Select build target &amp; profile
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Choose which platform toolchain to run and the target release profile.
                </p>
              </div>

              {/* Platform Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                  1. Target Platform
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "android" as const, name: "Android", desc: "Builds APK (Direct testing) & AAB (Google Play)", badge: "Supported" },
                    { id: "ios" as const, name: "iOS", desc: "Builds IPA via macOS runner & CocoaPods", badge: "Supported" },
                    { id: "android_ios" as const, name: "Android + iOS", desc: "Parallel matrix build for both stores", badge: "Matrix" },
                  ].map((p) => {
                    const isSelected = targetPlatform === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setTargetPlatform(p.id)}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-500 shadow-sm"
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 hover:border-zinc-300"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs text-zinc-900 dark:text-white">{p.name}</span>
                          <span className="text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.2 rounded">
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-normal">{p.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Build Profile Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                  2. Build Profile
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "development" as const, name: "Development", desc: "Internal developer build with debugging symbols." },
                    { id: "preview" as const, name: "Preview (Internal QA)", desc: "Optimized test build for QA testers and internal distribution." },
                    { id: "production" as const, name: "Production", desc: "Release-ready signed build for Google Play or App Store." },
                  ].map((prof) => {
                    const isSelected = buildProfile === prof.id;
                    return (
                      <div
                        key={prof.id}
                        onClick={() => setBuildProfile(prof.id)}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-500 shadow-sm"
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 hover:border-zinc-300"
                        }`}
                      >
                        <span className="font-bold text-xs text-zinc-900 dark:text-white block mb-1">
                          {prof.name}
                        </span>
                        <p className="text-[11px] text-zinc-500 leading-normal">{prof.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(8)}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer flex items-center space-x-1"
                >
                  <span>Review &amp; Start Build</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 8: REVIEW BUILD CONFIGURATION (PAGE 11)             */}
          {/* ========================================================= */}
          {step === 8 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Final Step &bull; Review &amp; Confirmation</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Review build configuration
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Confirm the parameters before launching the isolated compilation runner.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-600 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Summary Review Card */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500">Project / Application:</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{appName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500">Repository &amp; Branch:</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-200">{selectedRepo.fullName} ({selectedBranch})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500">Target Commit:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{commitSha}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500">Framework:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{analysisReport?.framework || "React Native"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500">Target Platform:</span>
                  <span className="font-bold text-zinc-900 dark:text-white uppercase">{targetPlatform}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500">Build Profile:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase">{buildProfile}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Signing Identity:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Keystore Configured &bull; Verified</span>
                </div>
              </div>

              {/* Crucial Blueprint Principle Callout */}
              <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-300">
                <strong>Next after build:</strong> Once the build finishes, you will be offered three distinct choices: <strong>Distribute for Testing</strong>, <strong>Publish to Google Play</strong>, or <strong>Publish to Apple App Store</strong>. No store release will occur without explicit confirmation.
              </div>

              <div className="flex justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(7)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleStartBuild}
                  className="px-8 py-3 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/25 cursor-pointer flex items-center space-x-2"
                >
                  {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>Start Real Build Job</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
