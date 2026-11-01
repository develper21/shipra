import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { NotificationService } from "@/server/services/notification.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  const prefs = await NotificationService.getPreferences(user.id);
  return apiSuccess(prefs);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  try {
    const { category, inApp, email } = await req.json();
    if (!category) return apiError("CATEGORY_REQUIRED", "Category is required", 422);

    const updated = await NotificationService.updatePreference(user.id, category, {
      inApp,
      email,
    });
    return apiSuccess(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update preferences";
    return apiError("UPDATE_FAILED", message, 400);
  }
}
