import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { NotificationService } from "@/server/services/notification.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";

  const notifications = await NotificationService.listNotifications(user.id, unreadOnly);
  return apiSuccess(notifications);
}
