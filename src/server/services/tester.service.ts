import { prisma } from "../db/prisma";

export class TesterService {
  /**
   * List testers for an app
   */
  static async listTesters(appId: string) {
    return prisma.tester.findMany({
      where: { appId },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        groupMembers: { include: { group: true } },
        feedbacks: { take: 5, orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Invite single tester
   */
  static async inviteTester(appId: string, email: string, groupId?: string) {
    const existing = await prisma.tester.findUnique({
      where: {
        appId_email: { appId, email: email.toLowerCase() },
      },
    });

    if (existing) {
      if (existing.status === "revoked") {
        return prisma.tester.update({
          where: { id: existing.id },
          data: { status: "active" },
        });
      }
      return existing;
    }

    const tester = await prisma.tester.create({
      data: {
        appId,
        email: email.toLowerCase(),
        status: "invited",
      },
    });

    if (groupId) {
      await prisma.testerGroupMember.create({
        data: {
          groupId,
          testerId: tester.id,
        },
      });
    }

    return tester;
  }

  /**
   * Bulk invite testers
   */
  static async bulkInvite(appId: string, emails: string[], groupId?: string) {
    const results = { invited: 0, skipped: 0 };

    for (const email of emails) {
      try {
        await this.inviteTester(appId, email, groupId);
        results.invited += 1;
      } catch {
        results.skipped += 1;
      }
    }

    return results;
  }

  /**
   * Revoke tester access
   */
  static async revokeTester(testerId: string) {
    return prisma.tester.update({
      where: { id: testerId },
      data: { status: "revoked" },
    });
  }

  /**
   * Tester groups CRUD
   */
  static async listGroups(appId: string) {
    return prisma.testerGroup.findMany({
      where: { appId },
      include: {
        _count: { select: { members: true } },
      },
    });
  }

  static async createGroup(appId: string, name: string) {
    return prisma.testerGroup.create({
      data: { appId, name },
    });
  }

  /**
   * Submit tester feedback
   */
  static async submitFeedback(
    buildId: string,
    data: {
      testerId?: string;
      rating?: number;
      comment: string;
      screenshotKey?: string;
    }
  ) {
    return prisma.testerFeedback.create({
      data: {
        buildId,
        testerId: data.testerId,
        rating: data.rating,
        comment: data.comment,
        screenshotKey: data.screenshotKey,
      },
    });
  }

  /**
   * List feedback for a build
   */
  static async listBuildFeedback(buildId: string) {
    return prisma.testerFeedback.findMany({
      where: { buildId },
      include: {
        tester: {
          select: {
            id: true,
            email: true,
            user: { select: { name: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
