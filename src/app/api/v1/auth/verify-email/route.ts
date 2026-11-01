import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { verifyEmailSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifyEmailSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const result = await AuthService.verifyEmail(parsed.data.email, parsed.data.code);
    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification failed";
    return apiError("VERIFY_FAILED", message, 400);
  }
}
