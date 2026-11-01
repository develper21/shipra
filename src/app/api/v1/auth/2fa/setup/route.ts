import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { AuthService } from "@/server/services/auth.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", 401);
  }

  try {
    const result = await AuthService.setup2fa(user.id);
    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "2FA setup failed";
    return apiError("2FA_SETUP_FAILED", message, 400);
  }
}
