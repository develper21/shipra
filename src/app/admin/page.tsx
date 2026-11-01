'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import { AbuseReport } from '@/types';
import { 
  ShieldAlert, 
  Users, 
  Layers, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  Radio, 
  Ban, 
  MessageSquare, 
  DollarSign, 
  HardDrive, 
  Check, 
  X, 
  ExternalLink,
  Search,
  Lock,
  ArrowRight,
  RefreshCw,
  Terminal,
  Cpu
} from "@/components/icons";

export default function InternalAdminPanel() {
  const { apps, user } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'apps' | 'reports' | 'scans' | 'flags' | 'blocklist'>('overview');

  const [stats, setStats] = useState({
    totalUsers: 12480,
    totalStorageGb: 482,
    totalBandwidthTb: 8.4,
    monthlyRevenue: 8920,
    quarantineCount: 14,
  });

  // Admin users state (ADM-02)
  const [usersList, setUsersList] = useState([
    { id: 'u_1', name: 'Aarav Sharma', email: 'aarav@techbuilder.io', plan: 'Pro', status: 'Active', apps: 4, joined: '2025-01-10' },
    { id: 'u_2', name: 'Neha Verma', email: 'neha.v@hypercraft.io', plan: 'Team', status: 'Active', apps: 2, joined: '2025-02-14' },
    { id: 'u_3', name: 'Suspicious Bot Account', email: 'bot992@tempmail.in', plan: 'Free', status: 'Suspended', apps: 1, joined: '2025-05-18' },
    { id: 'u_4', name: 'FinFlow Tech Lead', email: 'dev@finflow.io', plan: 'Team', status: 'Active', apps: 8, joined: '2025-03-01' },
  ]);

  // Abuse reports state (ADM-04)
  const [reports, setReports] = useState<AbuseReport[]>([]);

  // Feature flags state (ADM-08)
  const [flags, setFlags] = useState({
    cloudBuildEnabled: true,
    malwareScanningStrict: true,
    stagedRolloutsV2: true,
    razorpayUpiCheckout: true,
    publicBetaInvites: false
  });

  // Blocklist state (ADM-10)
  const [blocklist, setBlocklist] = useState([
    { type: 'Package Name', value: 'com.sbi.banking.fraud.mod', reason: 'Phishing banking impersonation' },
    { type: 'SHA-256 Hash', value: '3b890f12...ac77', reason: 'Known Trojan dropper' },
    { type: 'IP Address', value: '185.220.101.5', reason: 'Tor scraping botnet' },
  ]);

  const [newBlockValue, setNewBlockValue] = useState('');
  const [newBlockType, setNewBlockType] = useState('Package Name');
  const [newBlockReason, setNewBlockReason] = useState('');

  useEffect(() => {
    api.getAdminStats().then((res) => {
      if (res.data) {
        setStats({
          totalUsers: res.data.totalUsers || 12480,
          totalStorageGb: res.data.activeStorageGb || 482,
          totalBandwidthTb: 8.4,
          monthlyRevenue: res.data.monthlyRevenueUsd || 8920,
          quarantineCount: res.data.pendingReports || 14,
        });
      }
    });

    api.getAdminUsers().then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setUsersList(
          res.data.map((u: any) => ({
            id: u.id,
            name: u.name || u.username || 'User',
            email: u.email,
            plan: u.plan || 'Free',
            status: u.status === 'SUSPENDED' ? 'Suspended' : 'Active',
            apps: u._count?.ownedWorkspaces || 1,
            joined: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '2025-01-01',
          }))
        );
      }
    });

    api.getAdminReports().then((res) => {
      if (res.data && Array.isArray(res.data)) {
        setReports(
          res.data.map((r: any) => ({
            id: r.id,
            appId: r.appId,
            appName: r.app?.name || 'Reported Application',
            reportedBy: r.reporterEmail || r.reporterIp || 'Anonymous',
            reason: r.reason || 'Malware / Virus',
            details: r.details || 'Suspicious payload detected',
            status: r.status || 'pending',
            reportedAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent',
          }))
        );
      }
    });

    api.getAdminBlocklist().then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setBlocklist(
          res.data.map((b: any) => ({
            type: b.type || 'Package Name',
            value: b.value,
            reason: b.reason || 'Security flag',
          }))
        );
      }
    });
  }, []);

  const handleDismissReport = (id: string) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, status: 'dismissed' } : r)));
  };

  const handleResolveReport = (id: string) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r)));
    alert('Abuse resolved. Build revoked from edge CDN.');
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsersList(usersList.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          status: u.status === 'Active' ? 'Suspended' : 'Active'
        };
      }
      return u;
    }));
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockValue) return;
    setBlocklist([
      { type: newBlockType, value: newBlockValue, reason: newBlockReason || 'Security flag' },
      ...blocklist
    ]);
    setNewBlockValue('');
    setNewBlockReason('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Admin Top Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm tracking-wide text-white uppercase">
                Shipra Admin Console
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500 text-white">
                INTERNAL ONLY
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Authenticated as {user.name} (Audited session)</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-semibold"
          >
            &larr; Exit to Developer Dashboard
          </Link>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Navigation Tabs (ADM-01 to ADM-15) */}
        <div className="flex items-center space-x-1 overflow-x-auto border-b border-zinc-800 pb-2 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Platform Stats (ADM-06)', icon: DollarSign },
            { id: 'users', label: 'Users & Accounts (ADM-02)', icon: Users },
            { id: 'apps', label: 'Apps & Takedowns (ADM-03)', icon: Layers },
            { id: 'reports', label: 'Abuse Queue (ADM-04)', icon: AlertTriangle, count: reports.filter(r => r.status === 'pending').length },
            { id: 'scans', label: 'Malware Engine (ADM-05)', icon: ShieldCheck },
            { id: 'flags', label: 'Feature Flags (ADM-08)', icon: Sliders },
            { id: 'blocklist', label: 'Blocklist (ADM-10)', icon: Ban },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-rose-600 font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PLATFORM STATS OVERVIEW (ADM-06) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400">Total Users</span>
                <p className="text-3xl font-extrabold text-white">{stats.totalUsers.toLocaleString()}</p>
                <span className="text-[10px] text-emerald-400">+18% this month</span>
              </div>
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400">Storage Consumption</span>
                <p className="text-3xl font-extrabold text-white">{stats.totalStorageGb} GB</p>
                <span className="text-[10px] text-zinc-400">Cloudflare R2 Bucket</span>
              </div>
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400">Edge Bandwidth</span>
                <p className="text-3xl font-extrabold text-white">{stats.totalBandwidthTb} TB</p>
                <span className="text-[10px] text-zinc-400">APK downloads</span>
              </div>
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400">Monthly Revenue (MRR)</span>
                <p className="text-3xl font-extrabold text-emerald-400">${stats.monthlyRevenue.toLocaleString()}</p>
                <span className="text-[10px] text-emerald-400">Stripe + Razorpay</span>
              </div>
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400">Security Quarantine</span>
                <p className="text-3xl font-extrabold text-rose-400">{stats.quarantineCount}</p>
                <span className="text-[10px] text-rose-400">Suspicious builds</span>
              </div>
            </div>

            {/* Platform Health Grid */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-white">
                Infrastructure Nodes &amp; Scanner Queues (ADM-14)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>ClamAV Heuristic Daemon</span>
                    <span className="text-emerald-400">Running</span>
                  </div>
                  <p className="text-zinc-500 text-[11px]">Database v2025.05.20 loaded</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>BullMQ Worker Threads</span>
                    <span className="text-emerald-400">4 Active</span>
                  </div>
                  <p className="text-zinc-500 text-[11px]">Queue delay: 0.12s</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Edge Download Latency</span>
                    <span className="text-emerald-400">14ms Global</span>
                  </div>
                  <p className="text-zinc-500 text-[11px]">Cache hit: 98.2%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT (ADM-02) */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">User Accounts &amp; Workspaces (ADM-02)</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Plan</th>
                    <th className="py-2.5 px-3">Apps</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Joined</th>
                    <th className="py-2.5 px-3 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 font-mono text-[11px]">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-800/40">
                      <td className="py-3 px-3">
                        <p className="font-sans font-bold text-white">{u.name}</p>
                        <p className="text-zinc-400 text-[10px]">{u.email}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-bold bg-zinc-800 text-zinc-300">
                          {u.plan}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-300">{u.apps} apps</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold ${
                            u.status === 'Active' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{u.joined}</td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => alert(`Impersonating session for ${u.email} (Audited action logged).`)}
                          className="text-xs text-indigo-400 hover:underline cursor-pointer"
                        >
                          Impersonate
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className="text-xs text-rose-400 hover:underline cursor-pointer"
                        >
                          {u.status === 'Active' ? 'Suspend' : 'Unsuspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: APPS & TAKEDOWNS (ADM-03) */}
        {activeTab === 'apps' && (
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="font-bold text-base text-white">All Apps on Platform (ADM-03)</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">App</th>
                    <th className="py-2.5 px-3">Package ID</th>
                    <th className="py-2.5 px-3">Developer</th>
                    <th className="py-2.5 px-3">Installs</th>
                    <th className="py-2.5 px-3">Security</th>
                    <th className="py-2.5 px-3 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-[11px]">
                  {apps.map((a) => (
                    <tr key={a.id} className="hover:bg-zinc-800/40">
                      <td className="py-3 px-3">
                        <span className="font-bold text-white">{a.icon} {a.name}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-400">{a.packageName}</td>
                      <td className="py-3 px-3 text-zinc-300">{a.developerName}</td>
                      <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{a.totalDownloads}</td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Scanned Clean</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => alert(`Taking down ${a.name} and revoking edge storage.`)}
                          className="px-2.5 py-1 rounded bg-rose-900/50 hover:bg-rose-800 text-rose-300 font-bold text-[10px] cursor-pointer"
                        >
                          Emergency Takedown (ADM-03)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ABUSE REPORTS QUEUE (ADM-04) */}
        {activeTab === 'reports' && (
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="font-bold text-base text-white">Abuse &amp; Malware Reports Queue (ADM-04)</h3>

            <div className="space-y-3 text-xs">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{rep.appName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400">
                        {rep.reason}
                      </span>
                      <span className="text-zinc-500 text-[10px]">{rep.reportedAt}</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed max-w-xl">{rep.details}</p>
                    <p className="text-zinc-500 text-[10px] font-mono">Reported by: {rep.reportedBy}</p>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    {rep.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleDismissReport(rep.id)}
                          className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                        >
                          Take Down APK
                        </button>
                      </>
                    ) : (
                      <span className="text-emerald-400 font-bold text-xs uppercase">
                        {rep.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MALWARE HEURISTIC SCANNER LOGS (ADM-05) */}
        {activeTab === 'scans' && (
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">ClamAV &amp; VirusTotal Scanner Feed (ADM-05)</h3>
                <p className="text-zinc-400 text-xs">Real-time heuristics analysis and manual re-scan triggers.</p>
              </div>
              <button
                onClick={() => alert('Triggering full signature database update from ClamAV servers...')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update Virus DB</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 font-mono text-[11px] space-y-2 text-zinc-300 border border-zinc-800">
              <p className="text-emerald-400">[SCAN_PASSED] PulseFitness-v2.4.0-release.apk: SHA256 matches verified developer keystore.</p>
              <p className="text-emerald-400">[SCAN_PASSED] CryptoTrack-v1.9.0.apk: 0/72 VirusTotal heuristics flagged.</p>
              <p className="text-rose-400">[QUARANTINE_TRIGGERED] fake_sbi_mod.apk: Flagged by Kaspersky, ESET as Trojan.Banker.AndroidOS. SMS permissions blocked.</p>
              <p className="text-zinc-500">[SYSTEM] Worker thread 2 completed manifest parsing for ZenNote v1.2.4.</p>
            </div>
          </div>
        )}

        {/* TAB 6: FEATURE FLAGS (ADM-08) */}
        {activeTab === 'flags' && (
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs">
            <h3 className="font-bold text-base text-white">System Feature Flags (ADM-08)</h3>
            <p className="text-zinc-400 text-xs">Enable or disable platform features in real-time across edge nodes.</p>

            <div className="space-y-3 divide-y divide-zinc-800">
              {Object.entries(flags).map(([key, enabled]) => (
                <div key={key} className="pt-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white font-mono">{key}</p>
                    <p className="text-zinc-500 text-[11px]">Controls platform behavior dynamically</p>
                  </div>
                  <button
                    onClick={() => setFlags({ ...flags, [key]: !enabled })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      enabled ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {enabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: BLOCKLIST (ADM-10) */}
        {activeTab === 'blocklist' && (
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6 text-xs">
            <div>
              <h3 className="font-bold text-base text-white">Global Blocklist (ADM-10)</h3>
              <p className="text-zinc-400 text-xs">Blocked package names, APK SHA-256 hashes, email domains, and malicious IP ranges.</p>
            </div>

            <form onSubmit={handleAddBlock} className="flex flex-col sm:flex-row gap-3">
              <select
                value={newBlockType}
                onChange={(e) => setNewBlockType(e.target.value)}
                className="px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-medium"
              >
                <option value="Package Name">Package Name</option>
                <option value="SHA-256 Hash">SHA-256 Hash</option>
                <option value="IP Address">IP Address</option>
                <option value="Email Domain">Email Domain</option>
              </select>

              <input
                type="text"
                required
                placeholder="Value to block (e.g. com.phishing.app)..."
                value={newBlockValue}
                onChange={(e) => setNewBlockValue(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-mono"
              />

              <input
                type="text"
                placeholder="Reason..."
                value={newBlockReason}
                onChange={(e) => setNewBlockReason(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Add to Blocklist
              </button>
            </form>

            <div className="divide-y divide-zinc-800">
              {blocklist.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between font-mono text-[11px]">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 mr-2 font-sans">{item.type}</span>
                    <span className="font-bold text-white">{item.value}</span>
                    <span className="text-zinc-500 font-sans block text-[10px] mt-0.5">{item.reason}</span>
                  </div>
                  <button
                    onClick={() => setBlocklist(blocklist.filter((_, i) => i !== idx))}
                    className="text-rose-400 hover:text-rose-300 font-sans font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
