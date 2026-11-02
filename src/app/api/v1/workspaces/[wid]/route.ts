import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { WorkspaceService } from "@/server/services/workspace.service";
import { can } from "@/server/policies/rbac";
import { updateWorkspaceSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  if (!can(user, "workspace:read")) {
    return apiError("FORBIDDEN", "You do not have access to this workspace", 403);
  }

  const workspace = await WorkspaceService.getWorkspace(params.wid);
  if (!workspace) return apiError("NOT_FOUND", "Workspace not found", 404);

  return apiSuccess(workspace);
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  if (!can(user, "workspace:update")) {
    return apiError("FORBIDDEN", "Insufficient permissions to update workspace", 403);
  }

  try {
    const body = await req.json();
    const parsed = updateWorkspaceSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const updated = await WorkspaceService.updateWorkspace(params.wid, parsed.data);
    return apiSuccess(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update workspace";
    return apiError("UPDATE_FAILED", message, 400);
  }
}
