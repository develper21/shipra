import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { BuildService } from "@/server/services/build.service";
import { can } from "@/server/policies/rbac";
import { updateBuildSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";
import { prisma } from "@/server/db/prisma";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const build = await BuildService.getBuild(params.id);
  if (!build) return apiError("NOT_FOUND", "Build not found", 404);

  return apiSuccess(build);
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const build = await BuildService.getBuild(params.id);
  if (!build) return apiError("NOT_FOUND", "Build not found", 404);

  const user = await getAuthUser(req, build.app.workspaceId);
  if (!user || !can(user, "build:upload")) {
    return apiError("FORBIDDEN", "Insufficient permissions to update build", 403);
  }

  try {
    const body = await req.json();
    const parsed = updateBuildSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const updated = await prisma.build.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return apiSuccess({
      ...updated,
      sizeBytes: Number(updated.sizeBytes),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update build";
    return apiError("UPDATE_FAILED", message, 400);
  }
}
