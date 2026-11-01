import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { NotificationService } from "@/server/services/notification.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  await NotificationService.markAllRead(user.id);
  return apiSuccess({ success: true, message: "All notifications marked as read" });
}
