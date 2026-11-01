import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { BuildService } from "@/server/services/build.service";
import { AppService } from "@/server/services/app.service";
import { can } from "@/server/policies/rbac";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const app = await AppService.getApp(params.id);
  if (!app) return apiError("NOT_FOUND", "App not found", 404);

  const user = await getAuthUser(req, app.workspaceId);
  if (!user && app.visibility === "private") {
    return apiError("UNAUTHORIZED", "Authentication required", 401);
  }

  const builds = await BuildService.listBuilds(params.id);
  return apiSuccess(builds);
}
