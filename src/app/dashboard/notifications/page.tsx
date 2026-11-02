'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { 
  Bell, 
  Check, 
  ShieldCheck, 
  UploadCloud, 
  Users, 
  CreditCard, 
  Sliders, 
  MessageSquare,
  Sparkles
} from "@/components/icons";

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  // Notification Preferences (NTF-06)
  const [prefBuilds, setPrefBuilds] = useState(true);
  const [prefSecurity, setPrefSecurity] = useState(true);
  const [prefBilling, setPrefBilling] = useState(true);
  const [prefTeam, setPrefTeam] = useState(false);

  const filtered = notifications.filter(
    (n) => filterType === 'all' || n.type === filterType
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Notifications &amp; Alerts
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              In-app notification feed and notification delivery preferences.
            </p>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors self-start sm:self-auto cursor-pointer"
          >
            Mark all as read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto text-xs font-semibold">
          {['all', 'build', 'security', 'billing', 'team'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Notifications Feed */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                item.read
                  ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xs'
                  : 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-zinc-400 font-mono block pt-1">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={() => markNotificationAsRead(item.id)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline shrink-0 cursor-pointer"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Notification Category Preferences (NTF-06) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Email &amp; In-App Notification Preferences (NTF-06)
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Build &amp; Deployment Notifications</p>
                <p className="text-zinc-500">Alerts when new APK finishes parsing, scanning, or fails.</p>
              </div>
              <input
                type="checkbox"
                checked={prefBuilds}
                onChange={(e) => setPrefBuilds(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Security &amp; Abuse Warnings</p>
                <p className="text-zinc-500">Immediate alerts on malware quarantine or abuse reports.</p>
              </div>
              <input
                type="checkbox"
                checked={prefSecurity}
                onChange={(e) => setPrefSecurity(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Billing &amp; Storage Limit Quotas</p>
                <p className="text-zinc-500">Warning when workspace storage reaches 80% or 95% capacity.</p>
              </div>
              <input
                type="checkbox"
                checked={prefBilling}
                onChange={(e) => setPrefBilling(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
