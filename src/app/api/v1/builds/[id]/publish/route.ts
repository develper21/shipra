import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { BuildService } from "@/server/services/build.service";
import { can } from "@/server/policies/rbac";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const build = await BuildService.getBuild(params.id);
  if (!build) return apiError("NOT_FOUND", "Build not found", 404);

  const user = await getAuthUser(req, build.app.workspaceId);
  if (!user || !can(user, "build:publish")) {
    return apiError("FORBIDDEN", "Insufficient permissions to publish build", 403);
  }

  try {
    const published = await BuildService.publishBuild(params.id);
    return apiSuccess({
      ...published,
      sizeBytes: Number(published.sizeBytes),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to publish build";
    return apiError("PUBLISH_FAILED", message, 400);
  }
}
