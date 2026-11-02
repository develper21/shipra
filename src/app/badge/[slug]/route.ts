import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { DistributionService } from "@/server/services/distribution.service";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const cleanSlug = params.slug.replace(/\.svg$/i, "");

  let versionName = "1.0.0";
  let appName = cleanSlug;

  try {
    const app = await prisma.app.findUnique({
      where: { slug: cleanSlug },
      include: {
        builds: {
          where: { status: "ready", deletedAt: null },
          orderBy: { versionCode: "desc" },
          take: 1,
        },
      },
    });

    if (app) {
      appName = app.name;
      if (app.builds[0]) {
        versionName = app.builds[0].versionName;
      }
    }
  } catch {
    // Graceful fallback for mock
  }

  const svg = DistributionService.generateBadgeSvg(appName, versionName);

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300, s-maxage=600",
    },
  });
}
