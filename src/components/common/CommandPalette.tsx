'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Search, 
  UploadCloud, 
  Layers, 
  Terminal, 
  Key, 
  Users, 
  ShieldAlert, 
  CreditCard, 
  BookOpen, 
  X,
  FileCode2,
  ExternalLink
} from "@/components/icons";

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, apps, toggleTheme } = useApp();
  const [query, setQuery] = useState('');
  const router = useRouter();

  if (!isCommandPaletteOpen) return null;

  const navigate = (path: string) => {
    setIsCommandPaletteOpen(false);
    setQuery('');
    router.push(path);
  };

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.packageName.toLowerCase().includes(query.toLowerCase()) ||
      app.slug.toLowerCase().includes(query.toLowerCase())
  );

  const quickNav = [
    { label: 'Upload New APK Build', icon: UploadCloud, action: () => navigate('/dashboard/upload'), tag: 'Action' },
    { label: 'Apps Dashboard', icon: Layers, action: () => navigate('/dashboard/apps'), tag: 'Navigation' },
    { label: 'Cloud Build (EAS Runner)', icon: Terminal, action: () => navigate('/dashboard/cloud-build'), tag: 'Navigation' },
    { label: 'API Tokens & Secrets', icon: Key, action: () => navigate('/dashboard/developer'), tag: 'Developer' },
    { label: 'Team Members & Roles', icon: Users, action: () => navigate('/dashboard/team'), tag: 'Workspace' },
    { label: 'Billing & Plan Usage', icon: CreditCard, action: () => navigate('/dashboard/billing'), tag: 'Billing' },
    { label: 'Documentation & Guides', icon: BookOpen, action: () => navigate('/docs'), tag: 'Docs' },
    { label: 'Internal Admin Panel', icon: ShieldAlert, action: () => navigate('/admin'), tag: 'Admin' },
    { label: 'Toggle Light / Dark Mode', icon: FileCode2, action: () => { toggleTheme(); setIsCommandPaletteOpen(false); }, tag: 'Theme' },
  ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search apps, builds, actions, guides... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 bg-transparent text-sm sm:text-base text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions */}
          {quickNav.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-2 block mb-1">
                Actions & Navigation
              </span>
              <div className="space-y-1">
                {quickNav.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-500">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                        {item.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Apps Section */}
          {filteredApps.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-2 block mb-1">
                My Apps ({filteredApps.length})
              </span>
              <div className="space-y-1">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => navigate(`/dashboard/apps/${app.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-lg">
                        {app.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white text-sm">{app.name}</p>
                        <p className="text-[11px] text-zinc-400 font-mono">{app.packageName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        {app.builds.length} builds
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {quickNav.length === 0 && filteredApps.length === 0 && (
            <div className="py-8 text-center text-zinc-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No results found for &quot;{query}&quot;</p>
              <p className="text-xs mt-1">Try searching for &quot;Upload&quot;, &quot;Pulse&quot;, or &quot;API&quot;</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Navigate with mouse or click</span>
          <div className="flex items-center space-x-3">
            <span>[ESC] to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
