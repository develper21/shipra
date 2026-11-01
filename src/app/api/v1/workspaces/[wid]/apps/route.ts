import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { AppService } from "@/server/services/app.service";
import { can } from "@/server/policies/rbac";
import { enforceLimit } from "@/server/policies/limits";
import { createAppSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  if (!can(user, "app:read")) {
    return apiError("FORBIDDEN", "Insufficient permissions to view apps", 403);
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;

  const apps = await AppService.listApps(params.wid, { search });
  return apiSuccess(apps);
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  if (!can(user, "app:create")) {
    return apiError("FORBIDDEN", "Insufficient permissions to create apps", 403);
  }

  // Quota enforcement check
  const quota = await enforceLimit(params.wid, "apps");
  if (!quota.allowed) {
    return apiError("PLAN_QUOTA_EXCEEDED", quota.reason || "Apps limit reached", 402);
  }

  try {
    const body = await req.json();
    const parsed = createAppSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const app = await AppService.createApp(params.wid, parsed.data);
    return apiSuccess(app, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create app";
    return apiError("CREATE_APP_FAILED", message, 400);
  }
}
