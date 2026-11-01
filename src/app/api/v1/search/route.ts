import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { prisma } from "@/server/db/prisma";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (q.trim().length === 0) {
    return apiSuccess({ apps: [], builds: [], testers: [] });
  }

  const [apps, builds, testers] = await Promise.all([
    prisma.app.findMany({
      where: {
        deletedAt: null,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { packageName: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, slug: true, packageName: true, iconKey: true },
      take: 5,
    }),
    prisma.build.findMany({
      where: {
        deletedAt: null,
        OR: [
          { versionName: { contains: q, mode: "insensitive" } },
          { releaseNotes: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        versionName: true,
        versionCode: true,
        app: { select: { id: true, name: true } },
      },
      take: 5,
    }),
    prisma.tester.findMany({
      where: {
        email: { contains: q, mode: "insensitive" },
      },
      select: { id: true, email: true, app: { select: { id: true, name: true } } },
      take: 5,
    }),
  ]);

  return apiSuccess({ apps, builds, testers });
}
