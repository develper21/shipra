'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Rocket, 
  Layers, 
  UploadCloud, 
  Terminal, 
  Users, 
  Key, 
  CreditCard, 
  Settings, 
  Bell, 
  ChevronDown, 
  Plus, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Search,
  Activity,
  Menu,
  X,
  LogOut,
  Sliders,
  ChevronRight,
  ShieldAlert
} from "@/components/icons";

const DashboardLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    user, 
    activeWorkspace, 
    setActiveWorkspace, 
    workspaces, 
    notifications, 
    markAllNotificationsAsRead, 
    setIsCommandPaletteOpen 
  } = useApp();

  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { label: 'Overview', href: '/dashboard', icon: Activity, exact: true },
    { label: 'Apps & Projects', href: '/dashboard/apps', icon: Layers, exact: false },
    { label: 'New Project / Build', href: '/dashboard/apps/new', icon: Plus, exact: true },
    { label: 'Build Pipeline (EAS)', href: '/dashboard/cloud-build', icon: Terminal, exact: true },
    { label: 'Team & Workspaces', href: '/dashboard/team', icon: Users, exact: true },
    { label: 'Developer Tools', href: '/dashboard/developer', icon: Key, exact: true },
    { label: 'Billing & Usage', href: '/dashboard/billing', icon: CreditCard, exact: true },
    { label: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined, exact: true },
    { label: 'Account Settings', href: '/dashboard/settings', icon: Settings, exact: true },
  ];

  const handleSelectWorkspace = (ws: typeof activeWorkspace) => {
    setActiveWorkspace(ws);
    setWorkspaceDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row transition-colors">
      {/* Mobile Top Header for Dashboard */}
      <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            {activeWorkspace.logo}
          </div>
          <span className="font-bold text-xs text-zinc-900 dark:text-white truncate max-w-[150px]">
            {activeWorkspace.name}
          </span>
        </div>

        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="relative p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          )}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 z-30 h-screen w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-4">
          {/* Brand Logo */}
          <div className="px-1 pt-1 pb-2">
            <Link href="/" className="inline-block">
              <img
                src="/shipra-logo.svg"
                alt="Shipra"
                className="h-7 w-auto object-contain dark:brightness-110"
              />
            </Link>
          </div>

          {/* Workspace Switcher Dropdown (TEAM-08) */}
          <div className="relative">
            <button
              onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm shadow-sm font-bold shrink-0">
                  {activeWorkspace.logo}
                </div>
                <div className="truncate">
                  <p className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                    {activeWorkspace.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wide">
                    {activeWorkspace.plan} Plan
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {workspaceDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 text-xs space-y-1">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1 block">
                  Workspaces
                </span>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => handleSelectWorkspace(ws)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span>{ws.logo}</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {ws.name}
                      </span>
                    </div>
                    {ws.id === activeWorkspace.id && (
                      <Check className="w-3.5 h-3.5 text-indigo-500" />
                    )}
                  </button>
                ))}
                <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <Link
                    href="/dashboard/team"
                    onClick={() => setWorkspaceDropdownOpen(false)}
                    className="w-full flex items-center space-x-2 p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Organization</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Command Palette Button inside sidebar (DASH-10) */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-xs text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search apps / docs</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-200 dark:bg-zinc-800 font-mono text-zinc-500">
              ⌘K
            </kbd>
          </button>

          {/* Navigation Links (DASH-07) */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Usage Meter (DASH-05) & Admin link */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          {/* Usage Meter */}
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-zinc-500">Storage Used</span>
              <span className="text-zinc-800 dark:text-zinc-200">1.8 GB / 5 GB</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '36%' }} />
            </div>
            <div className="flex justify-between items-center pt-0.5 text-[10px]">
              <span className="text-zinc-400">Free Tier</span>
              <Link href="/dashboard/billing" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Upgrade Plan
              </Link>
            </div>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2.5 truncate">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
              />
              <div className="truncate">
                <p className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
              </div>
            </div>
            <Link
              href="/"
              title="Sign Out"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Only Content Area, No Topbar) */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Page Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400">Loading...</div>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
};
