import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { loginSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";
import { checkRateLimit, applyRateLimitHeaders } from "@/server/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown_ip";
  const rate = checkRateLimit(`login:${ip}`, 5, 60);

  if (!rate.success) {
    const res = apiError("RATE_LIMIT_EXCEEDED", "Too many failed attempts. Try again in 60s.", 429);
    applyRateLimitHeaders(res.headers, rate);
    return res;
  }

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const result = await AuthService.login(parsed.data);

    // If 2FA is required, return flag without setting session cookie
    if ("requires2fa" in result) {
      return apiSuccess({ requires2fa: true, userId: result.userId });
    }

    const res = apiSuccess({ user: result.user });

    // Set HTTP-only session cookie
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
    const message = err instanceof Error ? err.message : "Invalid credentials";
    return apiError("LOGIN_FAILED", message, 401);
  }
}
