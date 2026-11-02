import crypto from "crypto";
import { prisma } from "../db/prisma";
import { Prisma } from "@prisma/client";
import { hashPassword, verifyPassword, hashIp } from "../lib/crypto";
import { getPresignedDownloadUrl } from "../lib/r2";

export class DistributionService {
  /**
   * Create a share link for a specific build or channel latest
   */
  static async createShareLink(
    appId: string,
    data: {
      buildId?: string;
      type?: "build" | "latest";
      password?: string;
      expiresAt?: string;
      maxDownloads?: number;
      requiresLogin?: boolean;
      allowedEmails?: string[];
    }
  ) {
    const rawToken = crypto.randomBytes(16).toString("hex");
    const passwordHash = data.password ? await hashPassword(data.password) : null;

    const link = await prisma.shareLink.create({
      data: {
        appId,
        buildId: data.buildId,
        token: rawToken,
        type: data.type || "build",
        passwordHash,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        maxDownloads: data.maxDownloads,
        requiresLogin: data.requiresLogin || false,
        allowedEmails: data.allowedEmails ? data.allowedEmails : undefined,
      },
    });

    return {
      ...link,
      token: rawToken,
      url: `/d/${rawToken}`,
    };
  }

  /**
   * Update share link properties
   */
  static async updateShareLink(
    linkId: string,
    data: {
      password?: string | null;
      expiresAt?: string | null;
      maxDownloads?: number | null;
      requiresLogin?: boolean;
      allowedEmails?: string[] | null;
    }
  ) {
    const passwordHash =
      data.password === undefined
        ? undefined
        : data.password === null
        ? null
        : await hashPassword(data.password);

    return prisma.shareLink.update({
      where: { id: linkId },
      data: {
        ...(passwordHash !== undefined ? { passwordHash } : {}),
        ...(data.expiresAt !== undefined
          ? { expiresAt: data.expiresAt ? new Date(data.expiresAt) : null }
          : {}),
        ...(data.maxDownloads !== undefined ? { maxDownloads: data.maxDownloads } : {}),
        ...(data.requiresLogin !== undefined ? { requiresLogin: data.requiresLogin } : {}),
        ...(data.allowedEmails !== undefined
          ? {
              allowedEmails:
                data.allowedEmails === null
                  ? Prisma.JsonNull
                  : data.allowedEmails,
            }
          : {}),
      },
    });
  }

  /**
   * Instantly revoke a share link
   */
  static async revokeLink(linkId: string) {
    return prisma.shareLink.update({
      where: { id: linkId },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Rotate share link token
   */
  static async rotateToken(linkId: string) {
    const newToken = crypto.randomBytes(16).toString("hex");
    return prisma.shareLink.update({
      where: { id: linkId },
      data: { token: newToken },
    });
  }

  /**
   * Resolve and execute direct download flow for /d/[token]
   */
  static async resolveDownload(
    token: string,
    requestMeta: {
      ip?: string | null;
      userAgent?: string | null;
      passwordHeader?: string | null;
    }
  ) {
    const link = await prisma.shareLink.findUnique({
      where: { token },
      include: {
        app: true,
        build: true,
      },
    });

    if (!link) {
      throw new Error("LINK_NOT_FOUND: Download link does not exist");
    }

    if (link.revokedAt) {
      throw new Error("LINK_REVOKED: This download link has been revoked");
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      throw new Error("LINK_EXPIRED: This download link has expired");
    }

    if (link.maxDownloads && link.downloadCount >= link.maxDownloads) {
      throw new Error("DOWNLOAD_LIMIT_REACHED: Download limit exceeded for this link");
    }

    // Password verification if required
    if (link.passwordHash) {
      if (!requestMeta.passwordHeader) {
        return { requiresPassword: true };
      }
      const match = await verifyPassword(requestMeta.passwordHeader, link.passwordHash);
      if (!match) {
        throw new Error("INCORRECT_PASSWORD: Password is incorrect");
      }
    }

    // Determine target build
    let targetBuild = link.build;
    if (!targetBuild) {
      // Find latest ready build in production channel
      targetBuild = await prisma.build.findFirst({
        where: { appId: link.appId, status: "ready", deletedAt: null },
        orderBy: { versionCode: "desc" },
      });
    }

    if (!targetBuild) {
      throw new Error("NO_BUILD_AVAILABLE: No active APK build found for this app");
    }

    // Bot detection heuristics
    const ua = (requestMeta.userAgent || "").toLowerCase();
    const isBot =
      ua.includes("bot") ||
      ua.includes("crawl") ||
      ua.includes("spider") ||
      ua.includes("curl") ||
      ua.includes("wget");

    const ipHashed = hashIp(requestMeta.ip);

    // Record download event asynchronously
    prisma.$transaction([
      prisma.shareLink.update({
        where: { id: link.id },
        data: { downloadCount: { increment: 1 } },
      }),
      prisma.downloadEvent.create({
        data: {
          linkId: link.id,
          buildId: targetBuild.id,
          ipHash: ipHashed,
          deviceModel: ua.includes("android") ? "Android Device" : "Browser / Desktop",
          androidVersion: ua.includes("android 14") ? "14.0" : ua.includes("android 13") ? "13.0" : "Android",
          source: link.type,
          isBot,
        },
      }),
    ]).catch(() => {});

    // Generate signed R2 download URL (5 minutes expiry)
    const apkFilename = `${link.app.slug}-v${targetBuild.versionName}.apk`;
    const signedUrl = await getPresignedDownloadUrl(targetBuild.storageKey, apkFilename, 300);

    return {
      requiresPassword: false,
      signedUrl,
      filename: apkFilename,
      build: {
        versionName: targetBuild.versionName,
        versionCode: targetBuild.versionCode,
        sizeBytes: Number(targetBuild.sizeBytes),
      },
    };
  }

  /**
   * Generate SVG Badge (DIST-17)
   */
  static generateBadgeSvg(appName: string, version: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="168" height="28" viewBox="0 0 168 28" fill="none">
  <rect width="168" height="28" rx="6" fill="#18181B"/>
  <rect x="0.5" y="0.5" width="167" height="27" rx="5.5" stroke="#27272A"/>
  <path d="M12 7H14V17H12V7ZM16 11H18V17H16V11ZM8 13H10V17H8V13Z" fill="#3B82F6"/>
  <text x="26" y="18" fill="#A1A1AA" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600">AppLaunch</text>
  <rect x="94" y="5" width="66" height="18" rx="4" fill="#3B82F6"/>
  <text x="127" y="17" fill="#FFFFFF" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700">v${version}</text>
</svg>`;
  }
}
