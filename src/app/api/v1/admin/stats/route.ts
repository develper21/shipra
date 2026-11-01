import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { AdminService } from "@/server/services/admin.service";
import { can } from "@/server/policies/rbac";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || !can(user, "admin:access")) {
    return apiError("FORBIDDEN", "Platform SysAdmin privileges required", 403);
  }

  const stats = await AdminService.getSystemStats();
  return apiSuccess(stats);
}
