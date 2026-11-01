import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { resetPasswordSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const result = await AuthService.resetPassword(parsed.data.token, parsed.data.password);
    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Password reset failed";
    return apiError("RESET_FAILED", message, 400);
  }
}
