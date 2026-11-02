/**
 * AppLaunch Frontend API Client
 * Connects UI components directly to backend /api/v1 routes
 */

export interface ApiResponse<T> {
  data?: T;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        error: json.error || {
          code: `HTTP_${res.status}`,
          message: res.statusText || 'Request failed',
        },
      };
    }

    return json;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    return {
      error: {
        code: 'NETWORK_ERROR',
        message,
      },
    };
  }
}

export const api = {
  // Auth
  getMe: () => request<any>('/api/v1/me'),
  updateProfile: (data: any) =>
    request<any>('/api/v1/me', { method: 'PATCH', body: JSON.stringify(data) }),
  changePassword: (data: any) =>
    request<any>('/api/v1/me/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  logout: () => request<any>('/api/v1/auth/logout', { method: 'POST' }),

  // Workspaces
  getWorkspaces: () => request<any[]>('/api/v1/workspaces'),
  createWorkspace: (data: { name: string; slug: string }) =>
    request<any>('/api/v1/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getWorkspace: (wid: string) => request<any>(`/api/v1/workspaces/${wid}`),
  getWorkspaceOverview: (wid: string) =>
    request<any>(`/api/v1/workspaces/${wid}/overview`),
  getWorkspaceMembers: (wid: string) =>
    request<any[]>(`/api/v1/workspaces/${wid}/members`),
  inviteWorkspaceMember: (wid: string, data: { email: string; role: string }) =>
    request<any>(`/api/v1/workspaces/${wid}/invites`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getWorkspaceInvites: (wid: string) =>
    request<any[]>(`/api/v1/workspaces/${wid}/invites`),

  // Apps
  getWorkspaceApps: (wid: string, search?: string) =>
    request<any[]>(
      `/api/v1/workspaces/${wid}/apps${search ? `?search=${encodeURIComponent(search)}` : ''}`
    ),
  createApp: (wid: string, data: any) =>
    request<any>(`/api/v1/workspaces/${wid}/apps`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getApp: (id: string) => request<any>(`/api/v1/apps/${id}`),
  updateApp: (id: string, data: any) =>
    request<any>(`/api/v1/apps/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteApp: (id: string) =>
    request<any>(`/api/v1/apps/${id}`, { method: 'DELETE' }),
  checkSlugAvailable: (slug: string) =>
    request<{ slug: string; available: boolean }>(
      `/api/v1/apps/slug-available?slug=${encodeURIComponent(slug)}`
    ),
  checkPackageAvailable: (pkg: string) =>
    request<{ packageName: string; available: boolean }>(
      `/api/v1/apps/package-available?package=${encodeURIComponent(pkg)}`
    ),

  // Builds & Channels
  getAppBuilds: (appId: string) => request<any[]>(`/api/v1/apps/${appId}/builds`),
  getBuild: (buildId: string) => request<any>(`/api/v1/builds/${buildId}`),
  publishBuild: (buildId: string) =>
    request<any>(`/api/v1/builds/${buildId}/publish`, { method: 'POST' }),
  getAppChannels: (appId: string) =>
    request<any[]>(`/api/v1/apps/${appId}/channels`),
  createChannel: (appId: string, name: string) =>
    request<any>(`/api/v1/apps/${appId}/channels`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  promoteChannel: (channelId: string, buildId: string) =>
    request<any>(`/api/v1/channels/${channelId}/promote`, {
      method: 'POST',
      body: JSON.stringify({ buildId }),
    }),
  rollbackChannel: (channelId: string) =>
    request<any>(`/api/v1/channels/${channelId}/rollback`, { method: 'POST' }),
  updateRollout: (channelId: string, rolloutPercent: number) =>
    request<any>(`/api/v1/channels/${channelId}/rollout`, {
      method: 'PATCH',
      body: JSON.stringify({ rolloutPercent }),
    }),

  // Uploads
  initUpload: (appId: string, data: { filename: string; sizeBytes: number }) =>
    request<any>(`/api/v1/apps/${appId}/uploads`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  completeUpload: (uploadId: string, appId: string, key: string, data: any) =>
    request<any>(
      `/api/v1/uploads/${uploadId}/complete?appId=${encodeURIComponent(appId)}&key=${encodeURIComponent(key)}`,
      { method: 'POST', body: JSON.stringify(data) }
    ),

  // Links & Sharing
  getAppLinks: (appId: string) => request<any[]>(`/api/v1/apps/${appId}/links`),
  createShareLink: (appId: string, data: any) =>
    request<any>(`/api/v1/apps/${appId}/links`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  revokeLink: (linkId: string) =>
    request<any>(`/api/v1/links/${linkId}/revoke`, { method: 'POST' }),
  rotateLinkToken: (linkId: string) =>
    request<any>(`/api/v1/links/${linkId}/rotate`, { method: 'POST' }),

  // Testers & Feedback
  getAppTesters: (appId: string) =>
    request<any[]>(`/api/v1/apps/${appId}/testers`),
  inviteTester: (appId: string, data: { email: string; groupId?: string }) =>
    request<any>(`/api/v1/apps/${appId}/testers`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  bulkInviteTesters: (appId: string, data: { emails: string[]; groupId?: string }) =>
    request<any>(`/api/v1/apps/${appId}/testers/bulk`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getBuildFeedback: (buildId: string) =>
    request<any[]>(`/api/v1/builds/${buildId}/feedback`),

  // Analytics
  getAppAnalyticsSummary: (appId: string) =>
    request<any>(`/api/v1/apps/${appId}/analytics/summary`),
  getAppAnalyticsBreakdown: (appId: string, by = 'country') =>
    request<any[]>(`/api/v1/apps/${appId}/analytics/breakdown?by=${by}`),
  getAppAnalyticsEvents: (appId: string) =>
    request<any[]>(`/api/v1/apps/${appId}/analytics/events`),

  // Developer Tools
  getWorkspaceTokens: (wid: string) =>
    request<any[]>(`/api/v1/workspaces/${wid}/tokens`),
  createWorkspaceToken: (wid: string, data: any) =>
    request<any>(`/api/v1/workspaces/${wid}/tokens`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  revokeToken: (tokenId: string) =>
    request<any>(`/api/v1/tokens/${tokenId}`, { method: 'DELETE' }),
  getWorkspaceWebhooks: (wid: string) =>
    request<any[]>(`/api/v1/workspaces/${wid}/webhooks`),
  createWorkspaceWebhook: (wid: string, data: any) =>
    request<any>(`/api/v1/workspaces/${wid}/webhooks`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  testWebhook: (webhookId: string) =>
    request<any>(`/api/v1/webhooks/${webhookId}/test`, { method: 'POST' }),

  // Billing
  getPlans: () => request<any[]>('/api/v1/plans'),
  getWorkspaceBilling: (wid: string) =>
    request<any>(`/api/v1/workspaces/${wid}/billing`),
  createCheckout: (wid: string, data: any) =>
    request<any>(`/api/v1/workspaces/${wid}/billing/checkout`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  applyCoupon: (code: string) =>
    request<any>('/api/v1/workspaces/any/billing/coupon', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  // Admin
  getAdminStats: () => request<any>('/api/v1/admin/stats'),
  getAdminUsers: (search?: string) =>
    request<any[]>(
      `/api/v1/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`
    ),
  takedownApp: (appId: string, reason: string) =>
    request<any>(`/api/v1/admin/apps/${appId}/takedown`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  restoreApp: (appId: string) =>
    request<any>(`/api/v1/admin/apps/${appId}/restore`, { method: 'POST' }),
  getAdminReports: () => request<any[]>('/api/v1/admin/reports'),
  getAdminBlocklist: () => request<any[]>('/api/v1/admin/blocklist'),

  // Notifications
  getNotifications: (unread = false) =>
    request<any[]>(`/api/v1/notifications${unread ? '?unread=true' : ''}`),
  markNotificationRead: (id: string) =>
    request<any>(`/api/v1/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () =>
    request<any>('/api/v1/notifications/read-all', { method: 'POST' }),
};
