import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { WorkspaceService } from "@/server/services/workspace.service";
import { can } from "@/server/policies/rbac";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  if (!can(user, "workspace:read")) {
    return apiError("FORBIDDEN", "Access denied", 403);
  }

  const overview = await WorkspaceService.getOverview(params.wid);
  return apiSuccess(overview);
}
