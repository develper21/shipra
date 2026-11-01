import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { DeveloperService } from "@/server/services/developer.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  await DeveloperService.revokeToken(params.id);
  return apiSuccess({ success: true, message: "API Token revoked" });
}
