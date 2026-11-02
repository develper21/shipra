import crypto from "crypto";
import { prisma } from "../db/prisma";
import { hashToken, verifyPassword } from "../lib/crypto";
import { MemberRole } from "@prisma/client";

export class WorkspaceService {
  /**
   * Get all workspaces the user has access to
   */
  static async getUserWorkspaces(userId: string) {
    const memberships = await prisma.membership.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            plan: true,
            _count: {
              select: {
                apps: { where: { deletedAt: null } },
                memberships: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      slug: m.workspace.slug,
      type: m.workspace.type,
      role: m.role,
      plan: m.workspace.plan.name,
      appsCount: m.workspace._count.apps,
      membersCount: m.workspace._count.memberships,
      logoUrl: m.workspace.logoUrl,
    }));
  }

  /**
   * Create new team workspace
   */
  static async createWorkspace(userId: string, data: { name: string; slug: string }) {
    const existing = await prisma.workspace.findUnique({
      where: { slug: data.slug.toLowerCase() },
    });

    if (existing) {
      throw new Error("SLUG_TAKEN: Workspace URL slug is already taken");
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: data.name,
        slug: data.slug.toLowerCase(),
        type: "team",
        ownerId: userId,
        planId: "free",
        memberships: {
          create: {
            userId,
            role: "owner",
          },
        },
      },
      include: { plan: true },
    });

    return workspace;
  }

  /**
   * Get workspace details by ID or slug
   */
  static async getWorkspace(idOrSlug: string) {
    return prisma.workspace.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        plan: true,
        _count: {
          select: {
            apps: { where: { deletedAt: null } },
            memberships: true,
          },
        },
      },
    });
  }

  /**
   * Update workspace settings
   */
  static async updateWorkspace(workspaceId: string, data: { name?: string; logoUrl?: string }) {
    return prisma.workspace.update({
      where: { id: workspaceId },
      data,
    });
  }

  /**
   * List members of a workspace
   */
  static async getMembers(workspaceId: string) {
    const members = await prisma.membership.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return members.map((m) => ({
      id: m.id,
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      username: m.user.username,
      avatarUrl: m.user.avatarUrl,
      role: m.role,
      joinedAt: m.createdAt,
    }));
  }

  /**
   * Invite member to workspace
   */
  static async inviteMember(
    workspaceId: string,
    email: string,
    role: MemberRole = "developer"
  ) {
    const rawToken = crypto.randomBytes(24).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invite = await prisma.invite.create({
      data: {
        workspaceId,
        email: email.toLowerCase(),
        role,
        tokenHash,
        expiresAt,
      },
    });

    return {
      inviteId: invite.id,
      email: invite.email,
      role: invite.role,
      token: rawToken,
      inviteUrl: `/invite/${rawToken}`,
    };
  }

  /**
   * Accept workspace invite
   */
  static async acceptInvite(token: string, userId: string) {
    const tokenHash = hashToken(token);
    const invite = await prisma.invite.findFirst({
      where: {
        tokenHash,
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { workspace: true },
    });

    if (!invite) {
      throw new Error("INVALID_INVITE: The invite link is invalid or expired");
    }

    // Upsert membership
    await prisma.membership.upsert({
      where: {
        workspaceId_userId: {
          workspaceId: invite.workspaceId,
          userId,
        },
      },
      create: {
        workspaceId: invite.workspaceId,
        userId,
        role: invite.role,
      },
      update: {
        role: invite.role,
      },
    });

    await prisma.invite.update({
      where: { id: invite.id },
      data: { acceptedAt: new Date() },
    });

    return { workspace: invite.workspace };
  }

  /**
   * Transfer workspace ownership
   */
  static async transferOwnership(
    workspaceId: string,
    currentOwnerId: string,
    newOwnerId: string,
    currentPasswordConfirmation: string
  ) {
    const owner = await prisma.user.findUnique({
      where: { id: currentOwnerId },
    });

    if (!owner || !owner.passwordHash) {
      throw new Error("UNAUTHORIZED: Invalid owner verification");
    }

    const valid = await verifyPassword(currentPasswordConfirmation, owner.passwordHash);
    if (!valid) {
      throw new Error("INVALID_PASSWORD: Incorrect password confirmation");
    }

    // Perform transaction
    await prisma.$transaction([
      prisma.workspace.update({
        where: { id: workspaceId },
        data: { ownerId: newOwnerId },
      }),
      prisma.membership.update({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId: newOwnerId,
          },
        },
        data: { role: "owner" },
      }),
      prisma.membership.update({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId: currentOwnerId,
          },
        },
        data: { role: "admin" },
      }),
    ]);

    return { success: true };
  }

  /**
   * Get workspace overview statistics
   */
  static async getOverview(workspaceId: string) {
    const [appsCount, buildsCount, totalDownloads] = await Promise.all([
      prisma.app.count({ where: { workspaceId, deletedAt: null } }),
      prisma.build.count({ where: { app: { workspaceId }, deletedAt: null } }),
      prisma.downloadEvent.count({ where: { build: { app: { workspaceId } } } }),
    ]);

    return {
      appsCount,
      buildsCount,
      totalDownloads,
      storageUsedMb: 142.5,
      bandwidthUsedGb: 18.2,
    };
  }
}
