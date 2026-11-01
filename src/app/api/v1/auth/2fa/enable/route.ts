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
    const { code } = await req.json();
    if (!code) return apiError("CODE_REQUIRED", "Verification code is required", 422);

    const result = await AuthService.enable2fa(user.id, code);
    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to enable 2FA";
    return apiError("2FA_ENABLE_FAILED", message, 400);
  }
}
