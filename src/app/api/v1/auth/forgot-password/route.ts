import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { forgotPasswordSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const result = await AuthService.forgotPassword(parsed.data.email);
    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process request";
    return apiError("FORGOT_PASSWORD_FAILED", message, 400);
  }
}
