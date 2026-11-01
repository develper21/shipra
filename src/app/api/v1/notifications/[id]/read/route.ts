import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { NotificationService } from "@/server/services/notification.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  await NotificationService.markRead(params.id, user.id);
  return apiSuccess({ success: true });
}
