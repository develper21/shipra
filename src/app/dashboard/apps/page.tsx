'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { 
  Layers, 
  Search, 
  Plus, 
  Grid, 
  List, 
  ExternalLink, 
  Download, 
  Eye, 
  ShieldCheck, 
  CheckCircle2, 
  Filter,
  ArrowRight
} from "@/components/icons";

export default function AppsListPage() {
  const { apps } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<string>('All');

  const filteredApps = apps.filter((app) => {
    const matchesQuery =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVis = filterVisibility === 'All' || app.visibility === filterVisibility;
    return matchesQuery && matchesVis;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Applications
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Manage Android packages, distribution channels, and tester access.
            </p>
          </div>

          <Link
            href="/dashboard/apps/new"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New App</span>
          </Link>
        </div>

        {/* Filter & View Mode Controls (APP-03) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, package ID, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Visibility</option>
              <option value="Public">Public</option>
              <option value="Unlisted">Unlisted</option>
              <option value="Private">Private</option>
            </select>
          </div>

          {/* Grid vs Table View Toggle */}
          <div className="flex items-center space-x-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-end sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Apps Display */}
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <Layers className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">No apps found</h3>
              <p className="text-xs text-zinc-500 mt-1">Try refining your search query or create a new app.</p>
            </div>
            <Link
              href="/dashboard/apps/new"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
            >
              <Plus className="w-4 h-4" />
              <span>Create First App</span>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                        {app.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h3 className="font-bold text-base text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {app.name}
                          </h3>
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400 truncate max-w-[180px]">
                          {app.packageName}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.visibility === 'Public'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : app.visibility === 'Unlisted'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {app.visibility}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                    {app.shortDescription}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 text-center text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Builds</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{app.builds.length}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Downloads</span>
                      <span className="font-bold text-emerald-500">{app.totalDownloads.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Version</span>
                      <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                        v{app.builds[0]?.versionName || '1.0.0'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                  <Link
                    href={`/a/${app.slug}`}
                    className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-white flex items-center space-x-1"
                  >
                    <span>Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <Link
                    href={`/dashboard/apps/${app.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Manage Hub
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Application</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4">Latest Version</th>
                  <th className="py-3 px-4">Installs</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{app.icon}</span>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white">{app.name}</p>
                          <p className="font-mono text-[10px] text-zinc-400">{app.packageName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{app.category}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {app.visibility}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      v{app.builds[0]?.versionName || '1.0.0'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-500">
                      {app.totalDownloads.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{app.updatedAt}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/dashboard/apps/${app.id}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors inline-block"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
