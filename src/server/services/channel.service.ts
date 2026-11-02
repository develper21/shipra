import { prisma } from "../db/prisma";

export class ChannelService {
  /**
   * Get all channels of an app
   */
  static async getChannels(appId: string) {
    const channels = await prisma.channel.findMany({
      where: { appId },
      include: {
        app: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // Hydrate current build details
    const builds = await prisma.build.findMany({
      where: { appId },
      select: {
        id: true,
        versionName: true,
        versionCode: true,
        sizeBytes: true,
        publishedAt: true,
      },
    });

    const buildMap = new Map(builds.map((b) => [b.id, b]));

    return channels.map((c) => ({
      id: c.id,
      name: c.name,
      rolloutPercent: c.rolloutPercent,
      currentBuild: c.currentBuildId
        ? {
            ...buildMap.get(c.currentBuildId),
            sizeBytes: Number(buildMap.get(c.currentBuildId)?.sizeBytes || 0),
          }
        : null,
      updatedAt: c.updatedAt,
    }));
  }

  /**
   * Create custom channel
   */
  static async createChannel(appId: string, name: string) {
    const existing = await prisma.channel.findFirst({
      where: { appId, name: name.toLowerCase() },
    });

    if (existing) {
      throw new Error("CHANNEL_EXISTS: Channel with this name already exists");
    }

    return prisma.channel.create({
      data: {
        appId,
        name: name.toLowerCase(),
        rolloutPercent: 100,
      },
    });
  }

  /**
   * Promote a build to channel
   */
  static async promoteBuild(channelId: string, buildId: string, byUserId?: string) {
    const [channel, build] = await Promise.all([
      prisma.channel.findUnique({ where: { id: channelId } }),
      prisma.build.findUnique({ where: { id: buildId } }),
    ]);

    if (!channel || !build) throw new Error("NOT_FOUND");

    await prisma.$transaction([
      prisma.channel.update({
        where: { id: channelId },
        data: { currentBuildId: buildId },
      }),
      prisma.channelHistory.create({
        data: {
          channelId,
          buildId,
          action: "promote",
          byUserId,
        },
      }),
    ]);

    return { success: true, channelId, buildId };
  }

  /**
   * Rollback to previous build
   */
  static async rollbackChannel(channelId: string, byUserId?: string) {
    const history = await prisma.channelHistory.findMany({
      where: { channelId },
      orderBy: { createdAt: "desc" },
      take: 2,
    });

    if (history.length < 2) {
      throw new Error("NO_PREVIOUS_BUILD: No previous build history to roll back to");
    }

    const targetBuildId = history[1].buildId;

    await prisma.$transaction([
      prisma.channel.update({
        where: { id: channelId },
        data: { currentBuildId: targetBuildId },
      }),
      prisma.channelHistory.create({
        data: {
          channelId,
          buildId: targetBuildId,
          action: "rollback",
          byUserId,
        },
      }),
    ]);

    return { success: true, rolledBackToBuildId: targetBuildId };
  }

  /**
   * Update channel rollout percentage (5% to 100%)
   */
  static async updateRollout(channelId: string, rolloutPercent: number) {
    return prisma.channel.update({
      where: { id: channelId },
      data: { rolloutPercent },
    });
  }

  /**
   * Get channel history
   */
  static async getHistory(channelId: string) {
    return prisma.channelHistory.findMany({
      where: { channelId },
      include: {
        build: {
          select: {
            id: true,
            versionName: true,
            versionCode: true,
            sizeBytes: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }
}
