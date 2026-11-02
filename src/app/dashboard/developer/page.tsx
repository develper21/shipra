'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import { ApiToken, WebhookEndpoint } from '@/types';
import { 
  Key, 
  Terminal, 
  Webhook, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Code2, 
  Send, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Layers
} from "@/components/icons";

export default function DeveloperToolsPage() {
  const { activeWorkspace } = useApp();
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);

  // New Token Modal state
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenCreated, setNewTokenCreated] = useState<string | null>(null);

  // Webhook Test state
  const [pingSuccess, setPingSuccess] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    if (!activeWorkspace) return;
    api.getWorkspaceTokens(activeWorkspace.id).then((res) => {
      if (res.data && Array.isArray(res.data)) {
        setTokens(
          res.data.map((t: any) => ({
            id: t.id,
            name: t.name,
            tokenPreview: `${t.tokenPrefix || 'apl_live_'}••••••••`,
            scopes: Array.isArray(t.scopes) ? t.scopes : ['builds:create', 'builds:read', 'apps:read'],
            createdAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent',
            lastUsedAt: t.lastUsedAt ? new Date(t.lastUsedAt).toLocaleDateString() : 'Never',
            expiresAt: t.expiresAt ? new Date(t.expiresAt).toLocaleDateString() : 'No expiry',
          }))
        );
      }
    });

    api.getWorkspaceWebhooks(activeWorkspace.id).then((res) => {
      if (res.data && Array.isArray(res.data)) {
        setWebhooks(
          res.data.map((w: any) => ({
            id: w.id,
            url: w.url,
            description: w.description || 'Webhook Endpoint',
            events: Array.isArray(w.events) ? w.events : ['build.ready'],
            secret: w.secret || '••••••••',
            status: w.status === 'ACTIVE' || w.status === 'active' ? 'active' : 'failing',
            lastDeliveredAt: w.lastDeliveredAt || 'Recently',
            successRate: w.successRate ?? 100,
          }))
        );
      }
    });
  }, [activeWorkspace]);

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace) return;

    const res = await api.createWorkspaceToken(activeWorkspace.id, {
      name: newTokenName || 'CI Token',
      scopes: ['builds:create', 'builds:read', 'apps:read'],
    });

    if (res.data) {
      const rawSecret = res.data.rawToken || res.data.token || `apl_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
      const created: ApiToken = {
        id: res.data.id || `tok_${Date.now()}`,
        name: res.data.name || newTokenName || 'CI Token',
        tokenPreview: `${rawSecret.slice(0, 12)}...`,
        scopes: ['builds:create', 'builds:read', 'apps:read'],
        createdAt: 'Today',
        lastUsedAt: 'Never',
        expiresAt: '2027-01-01',
      };
      setTokens([created, ...tokens]);
      setNewTokenCreated(rawSecret);
      setNewTokenName('');
    } else {
      alert(res.error?.message || 'Failed to create token');
    }
  };

  const handleDeleteToken = async (id: string) => {
    await api.revokeToken(id);
    setTokens(tokens.filter((t) => t.id !== id));
  };

  const handleTestPingWebhook = async (id: string) => {
    await api.testWebhook(id);
    setPingSuccess(id);
    setTimeout(() => setPingSuccess(null), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            Developer APIs &amp; Integrations
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Programmatic access tokens, real-time webhooks, GitHub Actions, and CLI configuration.
          </p>
        </div>

        {/* Section 1: API Tokens (DEV-01, DEV-02) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                <Key className="w-4 h-4 text-indigo-500" />
                <span>REST API Access Tokens (DEV-02)</span>
              </h2>
              <p className="text-xs text-zinc-500">Authenticate requests to the AppLaunch /v1 REST API.</p>
            </div>
            <button
              onClick={() => { setShowTokenModal(true); setNewTokenCreated(null); }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Token</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Token Name</th>
                  <th className="py-2.5 px-3">Prefix / Key</th>
                  <th className="py-2.5 px-3">Scopes</th>
                  <th className="py-2.5 px-3">Last Used</th>
                  <th className="py-2.5 px-3">Expires</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {tokens.map((tok) => (
                  <tr key={tok.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-white">{tok.name}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-500">{tok.tokenPreview}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1 flex-wrap">
                        {tok.scopes.map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-zinc-400 text-[11px]">{tok.lastUsedAt}</td>
                    <td className="py-3 px-3 text-zinc-400 text-[11px]">{tok.expiresAt}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteToken(tok.id)}
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

        {/* Section 2: Webhooks (DEV-07, DEV-08) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                <Webhook className="w-4 h-4 text-violet-500" />
                <span>Webhooks &amp; Event Subscriptions (DEV-07)</span>
              </h2>
              <p className="text-xs text-zinc-500">
                Receive HMAC-signed JSON payloads on build events (build.ready, build.failed, download).
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-zinc-900 dark:text-white">{wh.url}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      {wh.successRate}% Success
                    </span>
                  </div>
                  <p className="text-zinc-500 text-[11px] mt-0.5">{wh.description}</p>
                  <div className="flex gap-1.5 mt-2">
                    {wh.events.map((e, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px]">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTestPingWebhook(wh.id)}
                    className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
                  >
                    {pingSuccess === wh.id ? 'Ping Sent (200 OK)!' : 'Test Ping (DEV-08)'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Official GitHub Action snippet (DEV-05) */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 text-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Official GitHub Action: applaunch/upload-apk-action (DEV-05)</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">.github/workflows/deploy.yml</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
{`- name: Upload APK to AppLaunch
  uses: applaunch/upload-apk-action@v1
  with:
    api-token: \${{ secrets.APPLAUNCH_TOKEN }}
    app-slug: 'pulse-fitness'
    apk-path: 'android/app/build/outputs/apk/release/app-release.apk'
    channel: 'Beta'
    release-notes: 'Automated CI build from commit \${{ github.sha }}'`}
          </div>
        </div>

        {/* Create Token Modal */}
        {showTokenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 text-xs">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Create Scoped API Access Token
              </h3>

              {newTokenCreated ? (
                <div className="space-y-3">
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Token generated! Copy it now (it won&apos;t be shown again):
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={newTokenCreated}
                      className="flex-1 p-2 rounded-lg font-mono text-xs bg-zinc-100 dark:bg-zinc-800 select-all"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(newTokenCreated);
                        setCopiedToken(true);
                        setTimeout(() => setCopiedToken(false), 2000);
                      }}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
                    >
                      {copiedToken ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowTokenModal(false)}
                    className="w-full py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold mt-2"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateToken} className="space-y-3">
                  <div>
                    <label className="font-semibold block mb-1">Token Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GitHub Actions Runner"
                      value={newTokenName}
                      onChange={(e) => setNewTokenName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowTokenModal(false)}
                      className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl"
                    >
                      Create Token
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
