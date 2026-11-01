import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { DistributionService } from "@/server/services/distribution.service";
import { AppService } from "@/server/services/app.service";
import { can } from "@/server/policies/rbac";
import { createShareLinkSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";
import { prisma } from "@/server/db/prisma";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const app = await AppService.getApp(params.id);
  if (!app) return apiError("NOT_FOUND", "App not found", 404);

  const links = await prisma.shareLink.findMany({
    where: { appId: params.id, revokedAt: null },
    include: {
      build: { select: { versionName: true, versionCode: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(links);
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const app = await AppService.getApp(params.id);
  if (!app) return apiError("NOT_FOUND", "App not found", 404);

  const user = await getAuthUser(req, app.workspaceId);
  if (!user || !can(user, "link:create")) {
    return apiError("FORBIDDEN", "Insufficient permissions to create share links", 403);
  }

  try {
    const body = await req.json();
    const parsed = createShareLinkSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const link = await DistributionService.createShareLink(params.id, parsed.data);
    return apiSuccess(link, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create share link";
    return apiError("CREATE_LINK_FAILED", message, 400);
  }
}
