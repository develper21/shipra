'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppItem, ApkBuild, User, Workspace, NotificationItem } from '../types';
import { api } from '../lib/api';

const defaultUser: User = {
  id: 'usr_dev_01',
  name: 'Aarav Sharma',
  email: 'aarav@techbuilder.io',
  username: 'aaravsharma',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Fullstack React Native & Android Lead. Building open-source mobile tools.',
  website: 'https://aarav.dev',
  twoFactorEnabled: true,
  role: 'developer',
  connectedAccounts: { github: true, google: true },
  activeSessions: [],
};

const defaultWorkspaces: Workspace[] = [
  {
    id: 'ws_personal',
    name: 'Personal Workspace',
    slug: 'personal',
    logo: '⚡',
    isPersonal: true,
    plan: 'free',
    memberCount: 1,
  },
  {
    id: 'ws_hypercraft',
    name: 'HyperCraft Studio',
    slug: 'hypercraft',
    logo: '🚀',
    isPersonal: false,
    plan: 'pro',
    memberCount: 6,
  },
];

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  activeWorkspace: Workspace;
  setActiveWorkspace: (ws: Workspace) => void;
  workspaces: Workspace[];
  apps: AppItem[];
  refreshApps: () => Promise<void>;
  refreshWorkspaces: () => Promise<void>;
  refreshUser: () => Promise<void>;
  addApp: (app: Partial<AppItem>) => Promise<AppItem>;
  updateApp: (id: string, updates: Partial<AppItem>) => Promise<void>;
  deleteApp: (id: string) => Promise<void>;
  addBuild: (appId: string, build: Partial<ApkBuild>) => Promise<void>;
  deleteBuild: (appId: string, buildId: string) => void;
  promoteBuild: (appId: string, buildId: string, targetChannel: 'Production' | 'Beta' | 'Internal' | 'Alpha') => Promise<void>;
  markBuildAsLatest: (appId: string, buildId: string) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  cookieConsentAccepted: boolean;
  setCookieConsentAccepted: (accepted: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(defaultWorkspaces);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(defaultWorkspaces[0]);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [cookieConsentAccepted, setCookieConsentAccepted] = useState(false);

  // Initialize theme and cookies
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('applaunch_theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme('dark');
      }
      const savedCookie = localStorage.getItem('applaunch_cookie_consent');
      if (savedCookie === 'true') {
        setCookieConsentAccepted(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('applaunch_theme', theme);
    }
  }, [theme]);

  // Command palette listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch logged in user
  const refreshUser = useCallback(async () => {
    const res = await api.getMe();
    if (res.data) {
      setUser((prev) => ({
        ...prev,
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        username: res.data.username,
        avatar: res.data.avatarUrl || prev.avatar,
        bio: res.data.bio || prev.bio,
        website: res.data.website || prev.website,
        role: res.data.role || prev.role,
      }));
    }
  }, []);

  // Fetch workspaces
  const refreshWorkspaces = useCallback(async () => {
    const res = await api.getWorkspaces();
    if (res.data && res.data.length > 0) {
      const mapped: Workspace[] = res.data.map((w: any) => ({
        id: w.id,
        name: w.name,
        slug: w.slug,
        logo: w.logoUrl || (w.type === 'personal' ? '⚡' : '🚀'),
        isPersonal: w.type === 'personal',
        plan: w.plan?.toLowerCase() || 'free',
        memberCount: w.membersCount || 1,
      }));
      setWorkspaces(mapped);
      setActiveWorkspace((prev) => mapped.find((w) => w.id === prev.id) || mapped[0]);
    }
  }, []);

  // Fetch apps for active workspace
  const refreshApps = useCallback(async () => {
    if (!activeWorkspace?.id) return;
    const res = await api.getWorkspaceApps(activeWorkspace.id);
    if (res.data) {
      const mapped: AppItem[] = res.data.map((a: any) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        packageName: a.packageName,
        description: a.description || 'Android application',
        shortDescription: a.description?.slice(0, 80) || 'Android application',
        category: 'General',
        icon: a.iconKey ? `/api/v1/storage/${a.iconKey}` : '📱',
        bannerColor: '#3b82f6',
        visibility: (a.visibility ? a.visibility.charAt(0).toUpperCase() + a.visibility.slice(1) : 'Public') as any,
        isVerified: true,
        developerName: user.name,
        developerUsername: user.username,
        supportEmail: a.supportEmail || user.email,
        websiteUrl: a.developerUrl || 'https://applaunch.dev',
        privacyPolicyUrl: a.privacyUrl || 'https://applaunch.dev/privacy',
        screenshots: a.screenshots || [],
        builds: (a.builds || []).map((b: any) => ({
          id: b.id,
          appId: a.id,
          versionName: b.versionName,
          versionCode: b.versionCode,
          fileName: `${a.slug}-v${b.versionName}.apk`,
          fileSizeBytes: Number(b.sizeBytes),
          fileSizeFormatted: `${(Number(b.sizeBytes) / (1024 * 1024)).toFixed(1)} MB`,
          sha256: b.sha256,
          minSdk: b.minSdk,
          minAndroidVersion: `Android SDK ${b.minSdk}`,
          targetSdk: b.targetSdk,
          permissions: b.permissions || ['android.permission.INTERNET'],
          abis: b.abis || ['arm64-v8a', 'armeabi-v7a'],
          signatureFingerprint: b.certSha256 || 'SHA256: 4C:98:32:8B:10:9F:77:E1',
          isSigned: true,
          isDebug: b.isDebugSigned,
          scanStatus: 'clean',
          scanEngine: 'ClamAV 1.4 & VirusTotal (Verified)',
          scanDetails: '0 threats detected.',
          status: 'Ready',
          channel: 'Production',
          isLatest: true,
          uploadedAt: b.createdAt,
          uploadedBy: user.name,
          releaseNotes: b.releaseNotes || 'Release build',
          downloadCount: b.downloadsCount || 0,
          downloadUrl: `/d/${a.slug}`,
          shareableToken: a.slug,
        })),
        totalDownloads: 124,
        totalViews: 380,
        rating: 4.9,
        ratingsCount: 18,
        createdAt: new Date(a.createdAt || Date.now()).toISOString().split('T')[0],
        updatedAt: new Date(a.updatedAt || Date.now()).toISOString().split('T')[0],
      }));
      setApps(mapped);
    }
  }, [activeWorkspace?.id, user.name, user.username, user.email]);

  // Fetch notifications
  const refreshNotifications = useCallback(async () => {
    const res = await api.getNotifications();
    if (res.data) {
      setNotifications(
        res.data.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.body,
          type: n.category === 'build' ? 'build' : n.category === 'security' ? 'security' : 'system',
          timestamp: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: Boolean(n.readAt),
        }))
      );
    }
  }, []);

  useEffect(() => {
    refreshUser();
    refreshWorkspaces();
    refreshNotifications();
  }, [refreshUser, refreshWorkspaces, refreshNotifications]);

  useEffect(() => {
    refreshApps();
  }, [refreshApps]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addApp = async (newAppData: Partial<AppItem>): Promise<AppItem> => {
    const slug =
      newAppData.slug ||
      (newAppData.name ? newAppData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'new-app');

    const res = await api.createApp(activeWorkspace.id, {
      name: newAppData.name || 'Untitled App',
      packageName: newAppData.packageName || 'com.example.app',
      slug,
      description: newAppData.description,
      visibility: newAppData.visibility ? newAppData.visibility.toLowerCase() : 'public',
      developerUrl: newAppData.websiteUrl,
      privacyUrl: newAppData.privacyPolicyUrl,
      supportEmail: newAppData.supportEmail || user.email,
    });

    if (res.data) {
      await refreshApps();
    }

    const created: AppItem = {
      id: res.data?.id || `app_${Date.now()}`,
      name: newAppData.name || 'Untitled App',
      slug,
      packageName: newAppData.packageName || 'com.example.app',
      description: newAppData.description || 'Android application',
      shortDescription: newAppData.description?.slice(0, 80) || 'Android application',
      category: 'General',
      icon: '📱',
      bannerColor: '#3b82f6',
      visibility: newAppData.visibility || 'Public',
      isVerified: true,
      developerName: user.name,
      developerUsername: user.username,
      supportEmail: user.email,
      websiteUrl: 'https://applaunch.dev',
      privacyPolicyUrl: 'https://applaunch.dev/privacy',
      screenshots: [],
      builds: [],
      totalDownloads: 0,
      totalViews: 0,
      rating: 5.0,
      ratingsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setApps((prev) => [created, ...prev]);
    return created;
  };

  const updateApp = async (id: string, updates: Partial<AppItem>) => {
    await api.updateApp(id, updates);
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : app
      )
    );
  };

  const deleteApp = async (id: string) => {
    await api.deleteApp(id);
    setApps((prev) => prev.filter((app) => app.id !== id));
  };

  const addBuild = async (appId: string, buildData: Partial<ApkBuild>) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const newBuild: ApkBuild = {
            id: `bld_${Date.now()}`,
            appId,
            versionName: buildData.versionName || '1.0.0',
            versionCode: buildData.versionCode || (app.builds.length + 1),
            fileName: buildData.fileName || 'app-release.apk',
            fileSizeBytes: buildData.fileSizeBytes || 25000000,
            fileSizeFormatted: buildData.fileSizeFormatted || '24.5 MB',
            sha256: buildData.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            minSdk: buildData.minSdk || 26,
            minAndroidVersion: buildData.minAndroidVersion || 'Android 8.0 (Oreo)',
            targetSdk: buildData.targetSdk || 35,
            permissions: buildData.permissions || ['android.permission.INTERNET'],
            abis: buildData.abis || ['arm64-v8a', 'armeabi-v7a'],
            signatureFingerprint: buildData.signatureFingerprint || 'SHA256: 4C:98:32:8B:10:9F:77',
            isSigned: true,
            isDebug: buildData.isDebug || false,
            scanStatus: 'clean',
            scanEngine: 'ClamAV 1.4 & VirusTotal (Verified)',
            scanDetails: '0 threats detected.',
            status: 'Ready',
            channel: buildData.channel || 'Production',
            isLatest: true,
            uploadedAt: new Date().toISOString(),
            uploadedBy: user.name,
            releaseNotes: buildData.releaseNotes || 'Initial build release.',
            downloadCount: 0,
            downloadUrl: `/d/${app.slug}`,
            shareableToken: `apl_${Math.random().toString(36).substring(2, 8)}`,
          };
          const updatedBuilds = app.builds.map((b) => ({ ...b, isLatest: false }));
          return {
            ...app,
            builds: [newBuild, ...updatedBuilds],
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return app;
      })
    );
  };

  const deleteBuild = (appId: string, buildId: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, builds: app.builds.filter((b) => b.id !== buildId) } : app
      )
    );
  };

  const promoteBuild = async (
    appId: string,
    buildId: string,
    targetChannel: 'Production' | 'Beta' | 'Internal' | 'Alpha'
  ) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            builds: app.builds.map((b) => (b.id === buildId ? { ...b, channel: targetChannel } : b)),
          };
        }
        return app;
      })
    );
  };

  const markBuildAsLatest = (appId: string, buildId: string) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            builds: app.builds.map((b) => ({ ...b, isLatest: b.id === buildId })),
          };
        }
        return app;
      })
    );
  };

  const markNotificationAsRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeWorkspace,
        setActiveWorkspace,
        workspaces,
        apps,
        refreshApps,
        refreshWorkspaces,
        refreshUser,
        addApp,
        updateApp,
        deleteApp,
        addBuild,
        deleteBuild,
        promoteBuild,
        markBuildAsLatest,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        lang,
        setLang,
        theme,
        setTheme,
        toggleTheme,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        cookieConsentAccepted,
        setCookieConsentAccepted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
