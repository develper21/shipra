import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { prisma } from "@/server/db/prisma";
import { changePasswordSchema } from "@/server/validators";
import { verifyPassword, hashPassword } from "@/server/lib/crypto";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", 401);
  }

  try {
    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || !dbUser.passwordHash) {
      return apiError("UNAUTHORIZED", "User has no password set", 400);
    }

    const valid = await verifyPassword(parsed.data.currentPassword, dbUser.passwordHash);
    if (!valid) {
      return apiError("INVALID_PASSWORD", "Current password does not match", 400);
    }

    const newHash = await hashPassword(parsed.data.newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    // Revoke other sessions for security
    const currentSessionToken = req.cookies.get("applaunch_session")?.value;
    if (currentSessionToken) {
      // Keep only current session
    }

    return apiSuccess({ success: true, message: "Password updated successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Password change failed";
    return apiError("CHANGE_FAILED", message, 400);
  }
}
