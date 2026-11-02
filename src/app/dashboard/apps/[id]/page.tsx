'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';
import { ApkBuild, Tester, DownloadEvent } from '@/types';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Layers, 
  UploadCloud, 
  Share2, 
  Users, 
  Sliders, 
  BarChart3, 
  Settings, 
  QrCode, 
  Download, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Trash2, 
  AlertTriangle, 
  Lock, 
  Plus, 
  RefreshCw,
  GitBranch,
  Shield,
  FileText,
  Mail,
  Smartphone,
  Globe2,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight
} from "@/components/icons";

interface AppDetailHubProps {
  params: Promise<{ id: string }>;
}

export default function AppDetailHubPage({ params }: AppDetailHubProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { apps, updateApp, deleteApp, addBuild, deleteBuild, promoteBuild, markBuildAsLatest } = useApp();
  const appId = resolvedParams.id;

  const app = apps.find((a) => a.id === appId);

  const [activeTab, setActiveTab] = useState<'builds' | 'distribution' | 'testers' | 'channels' | 'analytics' | 'settings'>('builds');

  // Form states
  const [copiedLink, setCopiedLink] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newVersionName, setNewVersionName] = useState('2.5.0');
  const [newVersionCode, setNewVersionCode] = useState(43);
  const [newChannel, setNewChannel] = useState<'Production' | 'Beta' | 'Internal'>('Beta');
  const [newReleaseNotes, setNewReleaseNotes] = useState('### Release Notes\n* Bug fixes and performance improvements\n* Fixed crash on Android 15');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Distribution options (DIST-05, DIST-06, DIST-07)
  const [linkExpiry, setLinkExpiry] = useState('never');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [passwordValue, setPasswordValue] = useState('1234');
  const [downloadLimit, setDownloadLimit] = useState(0);

  // Testers state (TST-01 to TST-05)
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteGroup, setInviteGroup] = useState<'QA' | 'Beta' | 'VIP' | 'Internal'>('QA');
  const [testersList, setTestersList] = useState<Tester[]>([]);
  const [downloadEvents, setDownloadEvents] = useState<DownloadEvent[]>([]);
  const [inviteSent, setInviteSent] = useState(false);

  useEffect(() => {
    if (!appId) return;
    api.getAppTesters(appId).then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setTestersList(
          res.data.map((t: any) => ({
            id: t.id,
            email: t.email,
            name: t.name || t.email.split('@')[0],
            avatar: t.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            group: (t.group || 'QA') as 'QA' | 'Beta' | 'VIP' | 'Internal',
            joinedAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent',
            status: t.status === 'INVITED' ? 'invited' : 'active',
          }))
        );
      } else {
        setTestersList([
          {
            id: 'tst_01',
            email: 'qa.lead@hypercraft.io',
            name: 'Pooja Verma',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
            group: 'QA',
            joinedAt: 'May 02, 2025',
            device: 'Google Pixel 8 Pro',
            osVersion: 'Android 15',
            status: 'active'
          },
          {
            id: 'tst_02',
            email: 'tester.android@gmail.com',
            name: 'Devansh K',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
            group: 'Beta',
            joinedAt: 'Apr 28, 2025',
            device: 'Samsung Galaxy S24',
            osVersion: 'Android 14',
            status: 'active'
          }
        ]);
      }
    });

    api.getAppAnalyticsEvents(appId).then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setDownloadEvents(res.data);
      } else {
        setDownloadEvents([
          {
            id: 'ev_1',
            appId,
            appName: app?.name || 'App',
            version: '2.4.0',
            timestamp: 'Just now',
            country: 'India',
            countryCode: 'IN',
            deviceModel: 'Pixel 8 Pro',
            osVersion: 'Android 15',
            ipHash: 'e3b0c44298fc...',
            source: 'direct'
          },
          {
            id: 'ev_2',
            appId,
            appName: app?.name || 'App',
            version: '2.4.0',
            timestamp: '15m ago',
            country: 'United States',
            countryCode: 'US',
            deviceModel: 'Galaxy S24 Ultra',
            osVersion: 'Android 14',
            ipHash: 'a1b2c3d4...',
            source: 'qr'
          }
        ]);
      }
    });
  }, [appId, app?.name]);

  // Channels & Rollout slider state (VER-11)
  const [rolloutPercentage, setRolloutPercentage] = useState(100);
  const [compareBuildA, setCompareBuildA] = useState('');
  const [compareBuildB, setCompareBuildB] = useState('');

  // Settings form
  const [editName, setEditName] = useState(app?.name || '');
  const [editDesc, setEditDesc] = useState(app?.description || '');
  const [editVisibility, setEditVisibility] = useState(app?.visibility || 'Public');
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (!app) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center">
          <p>App not found.</p>
          <Link href="/dashboard/apps" className="text-indigo-600 underline text-xs">Return to Apps</Link>
        </div>
      </DashboardLayout>
    );
  }

  const latestBuild = app.builds.find((b) => b.isLatest) || app.builds[0];
  const shareableUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/a/${app.slug}` 
    : `https://applaunch.dev/a/${app.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateBuildUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(25);

    setTimeout(() => setUploadProgress(65), 300);
    setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
      setShowUploadModal(false);

      addBuild(app.id, {
        versionName: newVersionName,
        versionCode: Number(newVersionCode),
        fileName: `${app.name.replace(/\s+/g, '')}-v${newVersionName}.apk`,
        fileSizeFormatted: '34.8 MB',
        channel: newChannel,
        releaseNotes: newReleaseNotes,
        minAndroidVersion: 'Android 8.0 (Oreo)',
        targetSdk: 35,
        permissions: ['android.permission.INTERNET', 'android.permission.ACCESS_NETWORK_STATE', 'android.permission.POST_NOTIFICATIONS'],
        abis: ['arm64-v8a', 'armeabi-v7a', 'x86_64'],
        passwordProtected,
        expiresAt: linkExpiry !== 'never' ? linkExpiry : undefined,
      });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }, 900);
  };

  const handleInviteTester = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !appId) return;

    await api.inviteTester(appId, {
      email: inviteEmail,
      groupId: inviteGroup,
    });

    setTestersList((prev) => [
      {
        id: `tst_${Date.now()}`,
        email: inviteEmail,
        name: inviteEmail.split('@')[0],
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        group: inviteGroup,
        joinedAt: 'Just now',
        status: 'invited'
      },
      ...prev
    ]);
    setInviteEmail('');
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
  };

  const handleRemoveTester = (testerId: string) => {
    setTestersList((prev) => prev.filter((t) => t.id !== testerId));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateApp(app.id, {
      name: editName,
      description: editDesc,
      shortDescription: editDesc.slice(0, 80),
      visibility: editVisibility
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleDeleteApp = () => {
    if (confirm(`Are you sure you want to permanently delete "${app.name}" and all its builds? This action cannot be undone.`)) {
      deleteApp(app.id);
      router.push('/dashboard/apps');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/apps"
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
                style={{ backgroundColor: `${app.bannerColor}15` }}
              >
                {app.icon}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
                    {app.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {app.visibility}
                  </span>
                </div>
                <p className="text-xs font-mono text-zinc-400">{app.packageName}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href={`/a/${app.slug}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors flex items-center space-x-1.5"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New Build</span>
            </button>
          </div>
        </div>

        {/* 6 Hub Tabs Navigation (APP-04) */}
        <div className="flex items-center space-x-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 pb-px text-xs font-semibold">
          {[
            { id: 'builds', label: 'Builds & Binaries', icon: Layers, count: app.builds.length },
            { id: 'distribution', label: 'Distribution & Sharing', icon: Share2 },
            { id: 'testers', label: 'Testers & Groups', icon: Users, count: testersList.length },
            { id: 'channels', label: 'Channels & Rollouts', icon: Sliders },
            { id: 'analytics', label: 'Analytics & Telemetry', icon: BarChart3 },
            { id: 'settings', label: 'App Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: BUILDS (BLD-01 to BLD-21) */}
        {activeTab === 'builds' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    APK Build Binaries
                  </h3>
                  <p className="text-xs text-zinc-500">Every published build with signatures and virus scan statuses</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Build</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Version</th>
                      <th className="py-3 px-4">File Name / Size</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4">ABIs</th>
                      <th className="py-3 px-4">Malware Scan</th>
                      <th className="py-3 px-4">Uploaded</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {app.builds.map((build) => (
                      <tr key={build.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-zinc-900 dark:text-white font-mono">
                              v{build.versionName}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">({build.versionCode})</span>
                            {build.isLatest && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                LATEST
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <span className="text-zinc-800 dark:text-zinc-200 block truncate max-w-xs">{build.fileName}</span>
                          <span className="text-zinc-400 text-[10px]">{build.fileSizeFormatted}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {build.channel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[10px] text-zinc-500">
                          {build.abis?.join(', ') || 'arm64-v8a'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Clean</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                          {build.uploadedAt?.split('T')[0] || 'Recently'}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {!build.isLatest && (
                            <button
                              onClick={() => markBuildAsLatest(app.id, build.id)}
                              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                            >
                              Set Latest
                            </button>
                          )}
                          <button
                            onClick={() => deleteBuild(app.id, build.id)}
                            className="p-1 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Delete build"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DISTRIBUTION & SHARING (DIST-01 to DIST-17) */}
        {activeTab === 'distribution' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-6">
              {/* Permanent Share Link Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Permanent Latest Version Link (DIST-02)
                </h3>
                <p className="text-xs text-zinc-500">
                  Share this single link with QA testers or clients. It automatically resolves to the latest published APK on the Production channel.
                </p>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center space-x-1.5 cursor-pointer shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Security & Access Controls (DIST-05, DIST-06, DIST-07) */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Link Protection &amp; Expiry Policy
                </h3>

                <div className="space-y-4">
                  {/* Expiry Dropdown */}
                  <div>
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                      Link Expiry Lifetime (DIST-05)
                    </label>
                    <select
                      value={linkExpiry}
                      onChange={(e) => setLinkExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    >
                      <option value="never">Never Expire (Permanent)</option>
                      <option value="24h">Expire in 24 Hours</option>
                      <option value="7d">Expire in 7 Days</option>
                      <option value="30d">Expire in 30 Days</option>
                    </select>
                  </div>

                  {/* Password Protection (DIST-06) */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900 dark:text-white flex items-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Password Protection Gate</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={passwordProtected}
                        onChange={(e) => setPasswordProtected(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>
                    {passwordProtected && (
                      <input
                        type="text"
                        placeholder="Set link access passcode"
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs"
                      />
                    )}
                  </div>

                  {/* Download Limit (DIST-07) */}
                  <div>
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                      Maximum Download Limit (DIST-07)
                    </label>
                    <input
                      type="number"
                      placeholder="0 for unlimited downloads"
                      value={downloadLimit}
                      onChange={(e) => setDownloadLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                    <span className="text-[10px] text-zinc-400 mt-1 block">Set 0 for unlimited downloads.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code & Embed Badge (DIST-03, DIST-15) */}
            <div className="md:col-span-5 space-y-6">
              {/* QR Code Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-center space-y-4">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  High-Resolution QR Code (DIST-03)
                </h3>
                <div className="p-4 bg-white rounded-2xl shadow-md border border-zinc-200 inline-block">
                  <QrCode className="w-36 h-36 text-zinc-900 mx-auto" />
                </div>
                <p className="text-xs text-zinc-500">
                  Scan with Android camera for direct 1-tap APK installation.
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => alert('Downloaded QR Code as high-res PNG.')}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
                  >
                    Download PNG
                  </button>
                  <button
                    onClick={() => alert('Downloaded vector SVG for print/slides.')}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
                  >
                    Download SVG
                  </button>
                </div>
              </div>

              {/* Embed Badge Generator (DIST-15) */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 text-xs">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Website Embed Badge (DIST-15)
                </h3>
                <p className="text-zinc-500 text-[11px]">
                  Place this button on your portfolio, GitHub README, or marketing site:
                </p>
                <div className="p-2.5 rounded-xl bg-zinc-900 text-white inline-flex items-center space-x-2 font-mono text-[11px]">
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download on AppLaunch</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 font-mono text-[10px] text-zinc-400 break-all border border-zinc-200 dark:border-zinc-800">
                  {`<a href="${shareableUrl}"><img src="https://applaunch.dev/badge.svg" /></a>`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TESTERS & GROUPS (TST-01 to TST-10) */}
        {activeTab === 'testers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Invite Form */}
              <div className="md:col-span-5 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Invite QA &amp; Beta Testers (TST-01)
                </h3>
                <p className="text-zinc-500 text-[11px]">
                  Testers receive an expiring invite link to download private staging binaries.
                </p>

                {inviteSent && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Invitation sent successfully!</span>
                  </div>
                )}

                <form onSubmit={handleInviteTester} className="space-y-3">
                  <div>
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                      Tester Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tester@domain.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                      Tester Group Cohort (TST-03)
                    </label>
                    <select
                      value={inviteGroup}
                      onChange={(e) => setInviteGroup(e.target.value as typeof inviteGroup)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    >
                      <option value="QA">QA Team</option>
                      <option value="Beta">Beta Testing Cohort</option>
                      <option value="VIP">VIP Client Preview</option>
                      <option value="Internal">Internal Engineering</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs cursor-pointer"
                  >
                    Send Tester Invitation
                  </button>
                </form>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Bulk invite via CSV?</span>
                  <button
                    onClick={() => alert('Bulk CSV import dialog simulation.')}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    Import CSV (TST-01)
                  </button>
                </div>
              </div>

              {/* Testers List Table */}
              <div className="md:col-span-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Active Tester Roster ({testersList.length})
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">Real-time device info logged</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
                      <tr>
                        <th className="py-3 px-4">Tester</th>
                        <th className="py-3 px-4">Group</th>
                        <th className="py-3 px-4">Device Telemetry</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {testersList.map((t) => (
                        <tr key={t.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                          <td className="py-3 px-4">
                            <p className="font-bold text-zinc-900 dark:text-white">{t.name}</p>
                            <p className="text-[11px] text-zinc-400 font-mono">{t.email}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                              {t.group}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[11px] text-zinc-500 font-mono">
                            {t.device || 'No device paired yet'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleRemoveTester(t.id)}
                              className="text-rose-500 hover:text-rose-600 font-semibold cursor-pointer"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHANNELS & ROLLOUTS (VER-01 to VER-11) */}
        {activeTab === 'channels' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Production', 'Beta', 'Internal'].map((channelName) => {
                const channelBuilds = app.builds.filter((b) => b.channel === channelName);
                const latestInChannel = channelBuilds[0];

                return (
                  <div
                    key={channelName}
                    className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-zinc-900 dark:text-white">
                        {channelName} Channel
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">
                        {channelBuilds.length} builds
                      </span>
                    </div>

                    {latestInChannel ? (
                      <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 space-y-2 text-xs">
                        <div className="flex justify-between font-mono font-bold">
                          <span>v{latestInChannel.versionName}</span>
                          <span className="text-emerald-500">Active</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">{latestInChannel.fileName}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 italic">No builds deployed to this channel yet.</p>
                    )}

                    {channelName === 'Beta' && (
                      <button
                        onClick={() => {
                          if (latestInChannel) {
                            promoteBuild(app.id, latestInChannel.id, 'Production');
                            alert(`Promoted v${latestInChannel.versionName} to Production!`);
                          }
                        }}
                        className="w-full py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                      >
                        Promote to Production (VER-04)
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Staged Rollout Slider (VER-11) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center space-x-2">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                    <span>Staged Rollout Slider (VER-11)</span>
                  </h3>
                  <p className="text-xs text-zinc-500">Gradually distribute updates to a percentage of testers</p>
                </div>
                <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                  {rolloutPercentage}% of users
                </span>
              </div>

              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={rolloutPercentage}
                onChange={(e) => setRolloutPercentage(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>5% (Canary)</span>
                <span>25%</span>
                <span>50%</span>
                <span>100% (Full Release)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ANALYTICS (ANL-01 to ANL-11) */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-xs text-zinc-500 block mb-1">Total Downloads</span>
                <span className="text-3xl font-extrabold text-emerald-500">{app.totalDownloads.toLocaleString()}</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-xs text-zinc-500 block mb-1">Public Page Views</span>
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{app.totalViews.toLocaleString()}</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-xs text-zinc-500 block mb-1">Install Conversion Rate (ANL-08)</span>
                <span className="text-3xl font-extrabold text-indigo-500">
                  {Math.round((app.totalDownloads / (app.totalViews || 1)) * 100)}%
                </span>
              </div>
            </div>

            {/* Real-time Download Stream (ANL-06) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Live Download Events Log (ANL-06)
                  </h3>
                  <p className="text-xs text-zinc-500">Privacy-anonymized telemetry logs</p>
                </div>
                <button
                  onClick={() => alert('Exporting analytics CSV...')}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold"
                >
                  Export CSV (ANL-07)
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Country</th>
                      <th className="py-2.5 px-3">Device Model</th>
                      <th className="py-2.5 px-3">Android OS</th>
                      <th className="py-2.5 px-3">Traffic Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-mono text-[11px]">
                    {downloadEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                        <td className="py-2.5 px-3 text-zinc-400">{evt.timestamp}</td>
                        <td className="py-2.5 px-3 font-sans font-medium text-zinc-800 dark:text-zinc-200">
                          {evt.country} ({evt.countryCode})
                        </td>
                        <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">{evt.deviceModel}</td>
                        <td className="py-2.5 px-3 text-zinc-500">{evt.osVersion}</td>
                        <td className="py-2.5 px-3 uppercase text-[10px] font-semibold text-indigo-500">{evt.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS (APP-07 to APP-14) */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Edit App Information
              </h3>

              {settingsSaved && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-1.5">
                  <Check className="w-4 h-4" />
                  <span>App settings updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Application Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Visibility Mode
                  </label>
                  <select
                    value={editVisibility}
                    onChange={(e) => setEditVisibility(e.target.value as typeof editVisibility)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="Public">Public (Searchable and listed)</option>
                    <option value="Unlisted">Unlisted (Link only)</option>
                    <option value="Private">Private (Invite only)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
              </form>
            </div>

            {/* Danger Zone (APP-12) */}
            <div className="p-8 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-4">
              <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400">
                Danger Zone: Delete Application (APP-12)
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Permanently deletes this application, all associated APK builds on Cloudflare R2, download logs, and revokes public install URLs.
              </p>
              <button
                type="button"
                onClick={handleDeleteApp}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer"
              >
                Delete Application
              </button>
            </div>
          </div>
        )}

        {/* Upload Build Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div 
              className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                  Upload APK Build for {app.name}
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {isUploading ? (
                <div className="py-8 text-center space-y-3">
                  <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto animate-pulse" />
                  <p className="font-bold text-xs text-zinc-900 dark:text-white">
                    Uploading &amp; Scanning ({uploadProgress}%)
                  </p>
                  <div className="w-48 mx-auto bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSimulateBuildUpload} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Version Name</label>
                      <input
                        type="text"
                        required
                        value={newVersionName}
                        onChange={(e) => setNewVersionName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Version Code</label>
                      <input
                        type="number"
                        required
                        value={newVersionCode}
                        onChange={(e) => setNewVersionCode(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Target Channel</label>
                    <select
                      value={newChannel}
                      onChange={(e) => setNewChannel(e.target.value as typeof newChannel)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    >
                      <option value="Production">Production Channel</option>
                      <option value="Beta">Beta Channel</option>
                      <option value="Internal">Internal Staging</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Release Notes (Markdown)</label>
                    <textarea
                      rows={3}
                      value={newReleaseNotes}
                      onChange={(e) => setNewReleaseNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                    >
                      Upload &amp; Scan APK
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
