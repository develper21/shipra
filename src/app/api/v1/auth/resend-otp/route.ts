import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { resendOtpSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const result = await AuthService.resendOtp(parsed.data.email, parsed.data.purpose);
    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to resend code";
    return apiError("RESEND_OTP_FAILED", message, 429);
  }
}
