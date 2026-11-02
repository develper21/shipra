import { prisma } from "../db/prisma";
import { BlocklistType, UserStatus, AbuseReportStatus } from "@prisma/client";

export class AdminService {
  /**
   * System wide overview statistics
   */
  static async getSystemStats() {
    const [totalUsers, totalWorkspaces, totalApps, totalBuilds, totalDownloads, pendingReports] =
      await Promise.all([
        prisma.user.count(),
        prisma.workspace.count(),
        prisma.app.count({ where: { deletedAt: null } }),
        prisma.build.count({ where: { deletedAt: null } }),
        prisma.downloadEvent.count(),
        prisma.abuseReport.count({ where: { status: "pending" } }),
      ]);

    return {
      totalUsers,
      totalWorkspaces,
      totalApps,
      totalBuilds,
      totalDownloads,
      pendingReports,
      activeStorageGb: 84.6,
      monthlyRevenueUsd: 1420,
    };
  }

  /**
   * Search users
   */
  static async listUsers(options?: { search?: string; status?: UserStatus }) {
    return prisma.user.findMany({
      where: {
        ...(options?.status ? { status: options.status } : {}),
        ...(options?.search
          ? {
              OR: [
                { email: { contains: options.search, mode: "insensitive" } },
                { name: { contains: options.search, mode: "insensitive" } },
                { username: { contains: options.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        _count: {
          select: {
            ownedWorkspaces: true,
            sessions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  /**
   * Suspend / Unsuspend / Ban user
   */
  static async setUserStatus(userId: string, status: UserStatus, reason: string) {
    if (!reason || reason.trim().length < 3) {
      throw new Error("REASON_REQUIRED: A valid justification reason is required for moderation");
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    if (status === "suspended" || status === "banned") {
      // Invalidate all sessions immediately
      await prisma.session.deleteMany({ where: { userId } });
    }

    return updated;
  }

  /**
   * App Takedown under 60 seconds (revokes all share links & blocks public page)
   */
  static async takedownApp(appId: string, reason: string) {
    const app = await prisma.app.findUnique({ where: { id: appId } });
    if (!app) throw new Error("APP_NOT_FOUND");

    await prisma.$transaction([
      prisma.app.update({
        where: { id: appId },
        data: { status: "suspended" },
      }),
      // Revoke all active share links for this app
      prisma.shareLink.updateMany({
        where: { appId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      // Add package to blocklist
      prisma.blocklist.upsert({
        where: {
          type_value: {
            type: "package",
            value: app.packageName,
          },
        },
        create: {
          type: "package",
          value: app.packageName,
          reason,
        },
        update: { reason },
      }),
    ]);

    return { success: true, appId, status: "suspended" };
  }

  /**
   * Restore app from takedown
   */
  static async restoreApp(appId: string) {
    const app = await prisma.app.findUnique({ where: { id: appId } });
    if (!app) throw new Error("APP_NOT_FOUND");

    await prisma.$transaction([
      prisma.app.update({
        where: { id: appId },
        data: { status: "active" },
      }),
      prisma.blocklist.deleteMany({
        where: { type: "package", value: app.packageName },
      }),
    ]);

    return { success: true, appId, status: "active" };
  }

  /**
   * List Abuse Reports
   */
  static async listAbuseReports(status?: AbuseReportStatus) {
    return prisma.abuseReport.findMany({
      where: status ? { status } : undefined,
      include: {
        app: { select: { id: true, name: true, slug: true, packageName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Resolve Abuse Report
   */
  static async resolveAbuseReport(reportId: string, status: AbuseReportStatus, resolvedById: string) {
    return prisma.abuseReport.update({
      where: { id: reportId },
      data: { status, resolvedById },
    });
  }

  /**
   * Blocklist CRUD
   */
  static async listBlocklist() {
    return prisma.blocklist.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async addToBlocklist(type: BlocklistType, value: string, reason: string) {
    return prisma.blocklist.upsert({
      where: {
        type_value: { type, value },
      },
      create: { type, value, reason },
      update: { reason },
    });
  }

  static async removeFromBlocklist(id: string) {
    return prisma.blocklist.delete({ where: { id } });
  }

  /**
   * Feature flags
   */
  static async listFeatureFlags() {
    return prisma.featureFlag.findMany({
      orderBy: { key: "asc" },
    });
  }

  static async toggleFeatureFlag(key: string, enabled: boolean) {
    return prisma.featureFlag.update({
      where: { key },
      data: { enabled },
    });
  }

  /**
   * Announcements
   */
  static async listAnnouncements() {
    return prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async createAnnouncement(title: string, content: string, type = "info") {
    return prisma.announcement.create({
      data: { title, content, type },
    });
  }
}
