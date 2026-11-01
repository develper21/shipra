import { NextRequest } from "next/server";
import { checkPasswordStrength } from "@/server/lib/crypto";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (typeof password !== "string") {
      return apiError("INVALID_PAYLOAD", "Password string required", 422);
    }

    const strength = checkPasswordStrength(password);
    return apiSuccess(strength);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Calculation failed";
    return apiError("ERROR", message, 400);
  }
}
