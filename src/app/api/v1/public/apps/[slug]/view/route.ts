import { NextRequest } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hashIp } from "@/server/lib/crypto";
import { apiSuccess } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const ip = req.headers.get("x-forwarded-for") || undefined;
  const referrer = req.headers.get("referer") || undefined;
  const ua = (req.headers.get("user-agent") || "").toLowerCase();

  // Filter bots
  if (
    ua.includes("bot") ||
    ua.includes("spider") ||
    ua.includes("crawler") ||
    ua.includes("lighthouse")
  ) {
    return apiSuccess({ recorded: false, bot: true });
  }

  const app = await prisma.app.findUnique({
    where: { slug: params.slug },
  });

  if (app) {
    prisma.pageView
      .create({
        data: {
          appId: app.id,
          ipHash: hashIp(ip),
          referrer,
        },
      })
      .catch(() => {});
  }

  return apiSuccess({ recorded: true });
}
