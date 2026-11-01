import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { onboardingSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", 401);
  }

  try {
    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    // Save user preferences
    return apiSuccess({
      success: true,
      message: "Onboarding completed successfully",
      onboarded: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save onboarding";
    return apiError("ERROR", message, 400);
  }
}
