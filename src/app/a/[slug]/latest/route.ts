import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const { searchParams } = new URL(req.url);
  const channelName = searchParams.get("channel") || "production";

  const app = await prisma.app.findUnique({
    where: { slug: params.slug },
    include: {
      channels: { where: { name: channelName } },
    },
  });

  if (!app || !app.channels[0] || !app.channels[0].currentBuildId) {
    return NextResponse.redirect(new URL(`/a/${params.slug}`, req.url));
  }

  const build = await prisma.build.findUnique({
    where: { id: app.channels[0].currentBuildId },
  });

  if (!build) {
    return NextResponse.redirect(new URL(`/a/${params.slug}`, req.url));
  }

  // Redirect to direct install or app public page
  return NextResponse.redirect(new URL(`/a/${params.slug}?version=${build.versionCode}`, req.url));
}
