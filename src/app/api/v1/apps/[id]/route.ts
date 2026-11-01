import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { AppService } from "@/server/services/app.service";
import { can } from "@/server/policies/rbac";
import { updateAppSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const app = await AppService.getApp(params.id);
  if (!app) return apiError("NOT_FOUND", "App not found", 404);

  const user = await getAuthUser(req, app.workspaceId);
  if (!user && app.visibility === "private") {
    return apiError("UNAUTHORIZED", "Private app requires authentication", 401);
  }

  return apiSuccess(app);
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const app = await AppService.getApp(params.id);
  if (!app) return apiError("NOT_FOUND", "App not found", 404);

  const user = await getAuthUser(req, app.workspaceId);
  if (!user || !can(user, "app:update")) {
    return apiError("FORBIDDEN", "Insufficient permissions to update app", 403);
  }

  try {
    const body = await req.json();
    const parsed = updateAppSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const updated = await AppService.updateApp(params.id, parsed.data);
    return apiSuccess(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update app";
    return apiError("UPDATE_FAILED", message, 400);
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const app = await AppService.getApp(params.id);
  if (!app) return apiError("NOT_FOUND", "App not found", 404);

  const user = await getAuthUser(req, app.workspaceId);
  if (!user || !can(user, "app:delete")) {
    return apiError("FORBIDDEN", "Admin permissions required to delete app", 403);
  }

  await AppService.deleteApp(params.id);
  return apiSuccess({ success: true, message: "App deleted successfully" });
}
