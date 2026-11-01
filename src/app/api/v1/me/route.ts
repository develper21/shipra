import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { prisma } from "@/server/db/prisma";
import { updateProfileSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", 401);
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      avatarUrl: true,
      bio: true,
      website: true,
      role: true,
      locale: true,
      emailVerifiedAt: true,
      createdAt: true,
      twoFactor: { select: { enabledAt: true } },
    },
  });

  return apiSuccess(profile);
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", 401);
  }

  try {
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    // Check if new username is already taken
    if (parsed.data.username) {
      const existing = await prisma.user.findUnique({
        where: { username: parsed.data.username },
      });
      if (existing && existing.id !== user.id) {
        return apiError("USERNAME_TAKEN", "This username is already taken", 409);
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: parsed.data,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatarUrl: true,
        bio: true,
        website: true,
        locale: true,
      },
    });

    return apiSuccess(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Profile update failed";
    return apiError("UPDATE_FAILED", message, 400);
  }
}
