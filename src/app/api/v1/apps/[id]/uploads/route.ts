import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { BuildService } from "@/server/services/build.service";
import { AppService } from "@/server/services/app.service";
import { can } from "@/server/policies/rbac";
import { enforceLimit } from "@/server/policies/limits";
import { initUploadSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const app = await AppService.getApp(params.id);
  if (!app) return apiError("NOT_FOUND", "App not found", 404);

  const user = await getAuthUser(req, app.workspaceId);
  if (!user || !can(user, "build:upload")) {
    return apiError("FORBIDDEN", "Insufficient permissions to upload builds", 403);
  }

  try {
    const body = await req.json();
    const parsed = initUploadSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    // Storage quota check
    const quota = await enforceLimit(app.workspaceId, "storage", parsed.data.sizeBytes);
    if (!quota.allowed) {
      return apiError("STORAGE_LIMIT_EXCEEDED", quota.reason || "Storage quota exceeded", 402);
    }

    const init = await BuildService.initUpload(
      params.id,
      parsed.data.filename,
      parsed.data.sizeBytes
    );

    return apiSuccess(init, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to initialize upload";
    return apiError("INIT_UPLOAD_FAILED", message, 400);
  }
}
