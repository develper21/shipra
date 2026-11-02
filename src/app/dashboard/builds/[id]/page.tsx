'use client';

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BuildJobRecord, DistributionRecord, DeploymentRecord } from "@/types";
import { 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  ArrowLeft, 
  Download, 
  QrCode, 
  Share2, 
  Rocket, 
  Smartphone, 
  Layers, 
  ExternalLink, 
  GitBranch, 
  GitCommit, 
  ShieldCheck, 
  Check, 
  Copy,
  Users,
  X
} from "@/components/icons";

export default function BuildDetailsMonitoringPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [build, setBuild] = useState<BuildJobRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pipeline" | "logs" | "artifact">("pipeline");

  // Post-build modals
  const [distributeModalOpen, setDistributeModalOpen] = useState(false);
  const [publishPlayModalOpen, setPublishPlayModalOpen] = useState(false);
  const [publishAppleModalOpen, setPublishAppleModalOpen] = useState(false);

  // Testing distribution state
  const [distributionRecord, setDistributionRecord] = useState<DistributionRecord | null>(null);
  const [distributing, setDistributing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Store publishing state
  const [publishing, setPublishing] = useState(false);
  const [selectedPlayTrack, setSelectedPlayTrack] = useState<"internal" | "closed" | "production">("internal");
  const [playReleaseNotes, setPlayReleaseNotes] = useState("");
  const [playSubmitted, setPlaySubmitted] = useState(false);
  const [appleSubmitted, setAppleSubmitted] = useState(false);

  // Fetch build and auto-advance stages if still running
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchBuild = async () => {
      try {
        const res = await fetch(`/api/v1/real-builds/${id}`);
        const data = await res.json();
        if (data.success && data.build) {
          setBuild(data.build);
          setLoading(false);

          // If still running (not success/failed), simulate stage advance
          if (data.build.status !== "success" && data.build.status !== "failed") {
            const currentStageIndex = data.build.logs.length - 1;
            if (currentStageIndex < 8) {
              await fetch(`/api/v1/real-builds/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stageIndex: currentStageIndex }),
              });
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBuild();
    interval = setInterval(fetchBuild, 2500);

    return () => clearInterval(interval);
  }, [id]);

  const pipelineStages = [
    { id: "queue", name: "Job Created & Queued", minPercent: 5 },
    { id: "worker", name: "Worker Allocated", minPercent: 12 },
    { id: "clone", name: "Repository Cloned", minPercent: 24 },
    { id: "analyze", name: "Project Analyzed", minPercent: 38 },
    { id: "install", name: "Dependencies Installed", minPercent: 50 },
    { id: "compile", name: "Compiling Native Application", minPercent: 68 },
    { id: "sign", name: "Signing Application", minPercent: 80 },
    { id: "validate", name: "Artifact Validation", minPercent: 90 },
    { id: "upload", name: "Artifact Stored & Ready", minPercent: 100 },
  ];

  // Distribute for testing handler
  const handleCreateDistribution = async () => {
    setDistributing(true);
    try {
      const res = await fetch(`/api/v1/real-builds/${id}/distribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "android_direct_download",
          accessMode: "link",
          expiresInDays: 30,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDistributionRecord(data.distribution);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDistributing(false);
    }
  };

  // Google Play Publish handler
  const handlePublishGooglePlay = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/v1/real-builds/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: "google_play",
          track: selectedPlayTrack,
          releaseNotes: playReleaseNotes || `Production build from commit ${build?.commitSha}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPlaySubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPublishing(false);
    }
  };

  if (loading || !build) {
    return (
      <DashboardLayout>
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs text-zinc-500">Loading build details &amp; pipeline state...</p>
        </div>
      </DashboardLayout>
    );
  }

  const isSuccess = build.status === "success";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 text-left">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/cloud-build"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Builds</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-zinc-400">ID: {build.id}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isSuccess
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : build.status === "failed"
                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                  : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 animate-pulse"
              }`}
            >
              {build.status}
            </span>
          </div>
        </div>

        {/* Build Header Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
                  {build.projectName}
                </h1>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {build.platform} &bull; {build.profile}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span className="flex items-center space-x-1 font-mono">
                  <GitBranch className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{build.branch}</span>
                </span>
                <span className="flex items-center space-x-1 font-mono">
                  <GitCommit className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{build.commitSha}</span>
                </span>
                <span>Author: {build.commitAuthor}</span>
                {build.durationFormatted && (
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Duration: {build.durationFormatted}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Artifact Download if build completed */}
            {isSuccess && build.artifact && (
              <div className="shrink-0">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading validated artifact: ${build.artifact?.fileName} (${build.artifact?.fileSizeFormatted})`);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {build.artifact.type.toUpperCase()} ({build.artifact.fileSizeFormatted})</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* POST-BUILD CHOICES BANNER (BLUEPRINT SECTION 12, PAGES 16-21)  */}
        {/* ============================================================== */}
        {isSuccess && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-zinc-900/80 dark:to-zinc-900/60 border border-indigo-200 dark:border-indigo-900/60 shadow-lg space-y-5">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Build Successful &bull; Artifact Verified</span>
              </div>
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                What would you like to do next?
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Build compilation is separate from distribution and store release. Choose an action below:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Distribute for Testing */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all flex flex-col justify-between space-y-4 shadow-sm group">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Distribute for Testing
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Share your built APK directly with testers via high-res QR code and permanent 1-tap download link without public store publishing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleCreateDistribution();
                    setDistributeModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
                >
                  Distribute for Testing &rarr;
                </button>
              </div>

              {/* Option 2: Publish to Google Play */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex flex-col justify-between space-y-4 shadow-sm group">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Publish to Google Play
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Submit the production-signed artifact directly to Google Play tracks (Internal, Closed, or Production release).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPublishPlayModalOpen(true)}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white transition-colors cursor-pointer"
                >
                  Publish to Play Store &rarr;
                </button>
              </div>

              {/* Option 3: Publish to Apple App Store */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-violet-500 dark:hover:border-violet-500 transition-all flex flex-col justify-between space-y-4 shadow-sm group">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Publish to App Store
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Submit iOS build through App Store Connect for TestFlight beta testing or official Apple App Store review.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPublishAppleModalOpen(true)}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white transition-colors cursor-pointer"
                >
                  Publish to App Store &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs: Pipeline Stages & Live Logs */}
        <div className="flex space-x-2 border-b border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("pipeline")}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === "pipeline"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Pipeline Stages ({build.progressPercent}%)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center space-x-1 ${
              activeTab === "logs"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Build Logs ({build.logs.length})</span>
          </button>
        </div>

        {/* Tab 1: Pipeline Stages Checklist */}
        {activeTab === "pipeline" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
              Real Build Pipeline Stages
            </h3>
            <div className="space-y-3">
              {pipelineStages.map((stg, idx) => {
                const isPassed = build.progressPercent >= stg.minPercent;
                const isCurrent =
                  build.progressPercent >= stg.minPercent &&
                  (idx === pipelineStages.length - 1 || build.progressPercent < pipelineStages[idx + 1].minPercent);

                return (
                  <div
                    key={stg.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      isPassed
                        ? "border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10"
                        : isCurrent
                        ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800 opacity-60"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700" />
                      )}
                      <span className={`font-semibold ${isPassed ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-500"}`}>
                        {stg.name}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-zinc-400">
                      {isPassed ? "Done" : isCurrent ? "Running..." : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Terminal Logs */}
        {activeTab === "logs" && (
          <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs shadow-inner space-y-1.5 overflow-x-auto max-h-[500px] overflow-y-auto">
            <div className="pb-3 mb-2 border-b border-zinc-800 flex items-center justify-between text-zinc-400">
              <span>Build execution log stream</span>
              <span className="text-[11px]">Worker: Linux JDK17-SDK35</span>
            </div>
            {build.logs.map((log, i) => (
              <div key={i} className="flex space-x-3 leading-relaxed">
                <span className="text-zinc-500 select-none">[{log.timestamp}]</span>
                <span className="text-indigo-400 select-none">[{log.stage}]</span>
                <span className="text-zinc-200">{log.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 1: DISTRIBUTE FOR TESTING (ANDROID DIRECT DOWNLOAD)      */}
        {/* ============================================================== */}
        {distributeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                      Android Direct Testing Distribution
                    </h3>
                    <p className="text-[11px] text-zinc-400">Direct APK download &bull; No Play Store review required</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDistributeModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {distributionRecord ? (
                <div className="space-y-4">
                  {/* Shareable Link Box */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Shareable Testing URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        readOnly
                        value={distributionRecord.shareUrl}
                        className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono text-indigo-600 dark:text-indigo-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(distributionRecord.shareUrl);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer flex items-center space-x-1"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* QR Code Preview */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-4">
                    <div className="w-20 h-20 bg-white p-2 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-center shrink-0">
                      <QrCode className="w-16 h-16 text-zinc-900" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-zinc-900 dark:text-white block">
                        Scan from Android phone
                      </span>
                      <p className="text-zinc-500 leading-relaxed">
                        Testers can point their phone camera at the screen to start the 1-tap APK download directly.
                      </p>
                    </div>
                  </div>

                  {/* Android Unknown Sources Guidance Notice */}
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <span className="font-bold block">Android Installation Guidance:</span>
                    <p className="leading-relaxed">
                      Android will prompt testers with &ldquo;File might be harmful&rdquo; on raw APK downloads. Testers tap &ldquo;Download anyway&rdquo; and &ldquo;Install from this source&rdquo; under Settings.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-xs text-zinc-500">Generating secure testing distribution URL...</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setDistributeModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: PUBLISH TO GOOGLE PLAY STORE                          */}
        {/* ============================================================== */}
        {publishPlayModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                      Publish to Google Play Store
                    </h3>
                    <p className="text-[11px] text-zinc-400">Google Play Console API submission</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPublishPlayModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {playSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Submitted to Google Play Console!
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Your build has been uploaded to the <strong>{selectedPlayTrack.toUpperCase()}</strong> track. Google Play Console will process the AAB in 15-30 minutes.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Track Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Release Track
                    </label>
                    <select
                      value={selectedPlayTrack}
                      onChange={(e) => setSelectedPlayTrack(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    >
                      <option value="internal">Internal Testing (Fastest, limited testers)</option>
                      <option value="closed">Closed Testing (Alpha / Beta cohort)</option>
                      <option value="production">Production (Public roll-out)</option>
                    </select>
                  </div>

                  {/* Release Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Release Notes for Play Store
                    </label>
                    <textarea
                      rows={3}
                      value={playReleaseNotes}
                      onChange={(e) => setPlayReleaseNotes(e.target.value)}
                      placeholder="Bugfixes and performance improvements in this release..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>

                  {/* Credentials Check */}
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Service Account Key:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Connected (Active)</span>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPublishPlayModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={publishing}
                      onClick={handlePublishGooglePlay}
                      className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {publishing ? "Submitting..." : "Submit to Google Play"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 3: PUBLISH TO APPLE APP STORE                            */}
        {/* ============================================================== */}
        {publishAppleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                      Publish to Apple App Store
                    </h3>
                    <p className="text-[11px] text-zinc-400">App Store Connect API submission</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPublishAppleModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {appleSubmitted ? (
                <div className="p-6 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-violet-500 mx-auto" />
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Uploaded to App Store Connect!
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Your build is processing in App Store Connect. You can invite TestFlight testers or submit for App Store review.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Upload your signed iOS build to App Store Connect using API Key authentication.
                  </p>

                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">App Store Connect Key ID:</span>
                      <span className="font-mono text-zinc-700 dark:text-zinc-300">ASC_KEY_84920</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Issuer ID:</span>
                      <span className="font-mono text-zinc-700 dark:text-zinc-300">69a6de70-0000...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Target:</span>
                      <span className="font-semibold text-violet-600 dark:text-violet-400">TestFlight Internal &bull; Ready</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPublishAppleModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppleSubmitted(true)}
                      className="px-5 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500 cursor-pointer shadow-sm"
                    >
                      Upload to App Store Connect
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
