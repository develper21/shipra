import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { signupSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";
import { checkRateLimit, applyRateLimitHeaders } from "@/server/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown_ip";
  const rate = checkRateLimit(`signup:${ip}`, 5, 60);

  if (!rate.success) {
    const res = apiError("RATE_LIMIT_EXCEEDED", "Too many signup attempts. Try again in a minute.", 429);
    applyRateLimitHeaders(res.headers, rate);
    return res;
  }

  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const result = await AuthService.signup({
      email: parsed.data.email,
      password: parsed.data.password,
      name: parsed.data.name,
    });

    const res = apiSuccess(
      {
        user: result.user,
        workspace: result.workspace,
        debugOtp: result.debugOtp,
      },
      undefined,
      { status: 201 }
    );

    // Set secure HTTP-only session cookie
    res.cookies.set("applaunch_session", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    applyRateLimitHeaders(res.headers, rate);
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signup failed";
    return apiError("SIGNUP_FAILED", message, 400);
  }
}
