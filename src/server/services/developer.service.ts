import { prisma } from "../db/prisma";
import { generateApiToken, encryptData, decryptData, signWebhookPayload } from "../lib/crypto";

export class DeveloperService {
  /**
   * List API Tokens for a workspace
   */
  static async listTokens(workspaceId: string) {
    const tokens = await prisma.apiToken.findMany({
      where: { workspaceId, revokedAt: null },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return tokens.map((t) => ({
      id: t.id,
      name: t.name,
      prefix: t.prefix,
      scopes: t.scopes,
      createdBy: t.user.name,
      lastUsedAt: t.lastUsedAt,
      expiresAt: t.expiresAt,
      createdAt: t.createdAt,
    }));
  }

  /**
   * Create new API Token (raw token is only returned once upon creation)
   */
  static async createToken(
    workspaceId: string,
    userId: string,
    name: string,
    scopes: string[],
    expiresInDays?: number
  ) {
    const { token, hash, preview } = generateApiToken("apl_live");
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const record = await prisma.apiToken.create({
      data: {
        workspaceId,
        userId,
        name,
        tokenHash: hash,
        prefix: preview,
        scopes,
        expiresAt,
      },
    });

    return {
      id: record.id,
      name: record.name,
      token, // Only displayed once!
      prefix: record.prefix,
      scopes: record.scopes,
      expiresAt: record.expiresAt,
    };
  }

  /**
   * Revoke API token
   */
  static async revokeToken(tokenId: string) {
    return prisma.apiToken.update({
      where: { id: tokenId },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * List webhooks for a workspace
   */
  static async listWebhooks(workspaceId: string) {
    return prisma.webhook.findMany({
      where: { workspaceId },
      include: {
        _count: { select: { deliveries: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Create new webhook
   */
  static async createWebhook(workspaceId: string, url: string, events: string[]) {
    const rawSecret = `whsec_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const secretEncrypted = encryptData(rawSecret);

    const webhook = await prisma.webhook.create({
      data: {
        workspaceId,
        url,
        secretEncrypted,
        events,
      },
    });

    return {
      id: webhook.id,
      url: webhook.url,
      events: webhook.events,
      secret: rawSecret, // Shown once
      active: webhook.active,
    };
  }

  /**
   * Test webhook endpoint ping
   */
  static async testWebhook(webhookId: string) {
    const webhook = await prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (!webhook) throw new Error("WEBHOOK_NOT_FOUND");

    const secret = decryptData(webhook.secretEncrypted);
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = JSON.stringify({
      event: "test.ping",
      timestamp,
      message: "AppLaunch Webhook Test Notification",
    });

    const signature = signWebhookPayload(payload, secret, timestamp);

    try {
      const res = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AppLaunch-Signature": signature,
          "User-Agent": "AppLaunch-Webhooks/1.0",
        },
        body: payload,
      });

      await prisma.webhookDelivery.create({
        data: {
          webhookId,
          event: "test.ping",
          payload: JSON.parse(payload),
          statusCode: res.status,
          attempts: 1,
        },
      });

      return { success: res.ok, statusCode: res.status };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delivery failed";
      await prisma.webhookDelivery.create({
        data: {
          webhookId,
          event: "test.ping",
          payload: JSON.parse(payload),
          statusCode: 500,
          responseBody: message,
          attempts: 1,
        },
      });
      return { success: false, error: message };
    }
  }

  /**
   * Check in-app update for SDK (GET /public/check-update)
   */
  static async checkInAppUpdate(packageName: string, currentVersionCode: number, channelName = "production") {
    const app = await prisma.app.findFirst({
      where: { packageName: packageName.toLowerCase(), deletedAt: null },
      include: {
        channels: { where: { name: channelName } },
      },
    });

    if (!app || !app.channels[0] || !app.channels[0].currentBuildId) {
      return { updateAvailable: false };
    }

    const channel = app.channels[0];
    if (!channel || !channel.currentBuildId) {
      return { updateAvailable: false };
    }

    const build = await prisma.build.findUnique({
      where: { id: channel.currentBuildId },
    });

    if (!build || build.status !== "ready") {
      return { updateAvailable: false };
    }

    // Check rollout percentage (pseudo-random roll based on device or random)
    const rolloutPercent = channel.rolloutPercent;
    if (rolloutPercent < 100) {
      const roll = Math.floor(Math.random() * 100) + 1;
      if (roll > rolloutPercent) {
        return { updateAvailable: false, reason: "Phased rollout pending" };
      }
    }

    if (build.versionCode > currentVersionCode) {
      return {
        updateAvailable: true,
        mandatory: false,
        versionName: build.versionName,
        versionCode: build.versionCode,
        releaseNotes: build.releaseNotes,
        downloadUrl: `/a/${app.slug}/latest?channel=${channelName}`,
      };
    }

    return { updateAvailable: false };
  }
}
