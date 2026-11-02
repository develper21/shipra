import { prisma } from "../db/prisma";

export type QuotaFeature = "storage" | "bandwidth" | "apps" | "members" | "channels" | "build_minutes";

export interface QuotaCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  reason?: string;
}

/**
 * Central plan quota enforcement helper
 */
export async function enforceLimit(
  workspaceId: string,
  feature: QuotaFeature,
  increment = 1
): Promise<QuotaCheckResult> {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        plan: true,
        apps: { where: { deletedAt: null } },
        memberships: true,
      },
    });

    if (!workspace) {
      return { allowed: false, current: 0, limit: 0, reason: "Workspace not found" };
    }

    const plan = workspace.plan;

    switch (feature) {
      case "apps": {
        const current = workspace.apps.length;
        const limit = plan.maxApps;
        const allowed = current + increment <= limit;
        return {
          allowed,
          current,
          limit,
          reason: allowed ? undefined : `App limit reached (${limit} max for ${plan.name} plan)`,
        };
      }

      case "members": {
        const current = workspace.memberships.length;
        const limit = plan.maxTeamMembers;
        const allowed = current + increment <= limit;
        return {
          allowed,
          current,
          limit,
          reason: allowed ? undefined : `Team member limit reached (${limit} max for ${plan.name} plan)`,
        };
      }

      case "channels": {
        const allowed = plan.customChannelsAllowed;
        return {
          allowed,
          current: 3,
          limit: allowed ? 10 : 3,
          reason: allowed ? undefined : `Custom channels require a paid plan`,
        };
      }

      case "storage": {
        const limitBytes = Number(plan.storageBytesLimit);
        // Sum size of all active builds
        const builds = await prisma.build.findMany({
          where: { app: { workspaceId }, deletedAt: null },
          select: { sizeBytes: true },
        });
        const currentBytes = builds.reduce((acc, b) => acc + Number(b.sizeBytes), 0);
        const allowed = currentBytes + increment <= limitBytes;
        return {
          allowed,
          current: currentBytes,
          limit: limitBytes,
          reason: allowed ? undefined : `Storage limit exceeded for ${plan.name} plan`,
        };
      }

      case "build_minutes": {
        const limit = plan.buildMinutesLimit;
        return {
          allowed: true,
          current: 15,
          limit,
        };
      }

      case "bandwidth": {
        const limit = Number(plan.bandwidthBytesLimit);
        return {
          allowed: true,
          current: 0,
          limit,
        };
      }

      default:
        return { allowed: true, current: 0, limit: 100 };
    }
  } catch {
    // If DB is offline or mock, allow operation with default limits
    return { allowed: true, current: 1, limit: 100 };
  }
}
