import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { AdminService } from "@/server/services/admin.service";
import { can } from "@/server/policies/rbac";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || !can(user, "admin:access")) {
    return apiError("FORBIDDEN", "SysAdmin access required", 403);
  }

  const items = await AdminService.listBlocklist();
  return apiSuccess(items);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || !can(user, "admin:access")) {
    return apiError("FORBIDDEN", "SysAdmin access required", 403);
  }

  try {
    const { type, value, reason } = await req.json();
    if (!type || !value || !reason) {
      return apiError("VALIDATION_ERROR", "type, value, and reason are required", 422);
    }

    const item = await AdminService.addToBlocklist(type, value, reason);
    return apiSuccess(item, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add to blocklist";
    return apiError("BLOCKLIST_FAILED", message, 400);
  }
}
