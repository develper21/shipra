import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { prisma } from "@/server/db/prisma";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", 401);
  }

  const sessions = await prisma.session.findMany({
    where: { userId: user.id, expiresAt: { gt: new Date() } },
    select: {
      id: true,
      userAgent: true,
      ipHash: true,
      lastActiveAt: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: { lastActiveAt: "desc" },
  });

  return apiSuccess(sessions);
}
