import { prisma } from "../db/prisma";
import { AppVisibility, AppStatus } from "@prisma/client";
import { getPresignedUploadUrl } from "../lib/r2";

export class AppService {
  /**
   * List apps in a workspace with filters & pagination
   */
  static async listApps(workspaceId: string, options?: { search?: string; status?: AppStatus }) {
    return prisma.app.findMany({
      where: {
        workspaceId,
        deletedAt: null,
        ...(options?.status ? { status: options.status } : {}),
        ...(options?.search
          ? {
              OR: [
                { name: { contains: options.search, mode: "insensitive" } },
                { packageName: { contains: options.search, mode: "insensitive" } },
                { slug: { contains: options.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        builds: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        channels: true,
        _count: {
          select: {
            builds: { where: { deletedAt: null } },
            testers: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  /**
   * Check if slug is available
   */
  static async isSlugAvailable(slug: string): Promise<boolean> {
    const existing = await prisma.app.findUnique({
      where: { slug: slug.toLowerCase() },
    });
    return !existing;
  }

  /**
   * Check if package name is available
   */
  static async isPackageAvailable(packageName: string): Promise<boolean> {
    const existing = await prisma.app.findFirst({
      where: { packageName: packageName.toLowerCase(), deletedAt: null },
    });
    return !existing;
  }

  /**
   * Create new app with default channels (production, beta, internal)
   */
  static async createApp(
    workspaceId: string,
    data: {
      name: string;
      packageName: string;
      slug: string;
      description?: string;
      visibility?: AppVisibility;
      developerUrl?: string;
      privacyUrl?: string;
      supportEmail?: string;
    }
  ) {
    const isAvail = await this.isSlugAvailable(data.slug);
    if (!isAvail) {
      throw new Error("SLUG_TAKEN: An app with this URL slug already exists");
    }

    const app = await prisma.app.create({
      data: {
        workspaceId,
        name: data.name,
        packageName: data.packageName.toLowerCase(),
        slug: data.slug.toLowerCase(),
        description: data.description,
        visibility: data.visibility || "public",
        developerUrl: data.developerUrl,
        privacyUrl: data.privacyUrl,
        supportEmail: data.supportEmail,
        channels: {
          createMany: {
            data: [
              { name: "production", rolloutPercent: 100 },
              { name: "beta", rolloutPercent: 100 },
              { name: "internal", rolloutPercent: 100 },
            ],
          },
        },
      },
      include: {
        channels: true,
      },
    });

    return app;
  }

  /**
   * Get app by ID or slug with latest builds & channels
   */
  static async getApp(idOrSlug: string) {
    return prisma.app.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        deletedAt: null,
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        builds: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { scanResults: true },
        },
        channels: true,
        screenshots: { orderBy: { position: "asc" } },
        _count: {
          select: {
            builds: { where: { deletedAt: null } },
            testers: true,
            shareLinks: true,
          },
        },
      },
    });
  }

  /**
   * Update app details
   */
  static async updateApp(appId: string, data: Partial<{
    name: string;
    description: string;
    visibility: AppVisibility;
    developerUrl: string | null;
    privacyUrl: string | null;
    supportEmail: string | null;
  }>) {
    return prisma.app.update({
      where: { id: appId },
      data,
    });
  }

  /**
   * Soft delete app
   */
  static async deleteApp(appId: string) {
    return prisma.app.update({
      where: { id: appId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Archive / Unarchive app
   */
  static async setArchiveStatus(appId: string, archive: boolean) {
    return prisma.app.update({
      where: { id: appId },
      data: { status: archive ? "archived" : "active" },
    });
  }

  /**
   * Presign App Icon Upload
   */
  static async getIconUploadUrl(appId: string, extension = "png") {
    const key = `apps/${appId}/icon.${extension}`;
    return getPresignedUploadUrl(key, `image/${extension}`);
  }

  /**
   * Presign App Screenshot Upload
   */
  static async getScreenshotUploadUrl(appId: string, extension = "png") {
    const key = `apps/${appId}/screenshots/${Date.now()}.${extension}`;
    return getPresignedUploadUrl(key, `image/${extension}`);
  }

  /**
   * Transfer app to another workspace
   */
  static async transferApp(appId: string, targetWorkspaceId: string) {
    return prisma.app.update({
      where: { id: appId },
      data: { workspaceId: targetWorkspaceId },
    });
  }
}
