import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { AdminService } from "@/server/services/admin.service";
import { can } from "@/server/policies/rbac";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req);
  if (!user || !can(user, "admin:access")) {
    return apiError("FORBIDDEN", "SysAdmin access required", 403);
  }

  try {
    const result = await AdminService.restoreApp(params.id);
    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Restore failed";
    return apiError("RESTORE_FAILED", message, 400);
  }
}
