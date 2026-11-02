import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;

  // Resolve share link by short token code
  const link = await prisma.shareLink.findFirst({
    where: {
      OR: [
        { token: params.code },
        { token: { startsWith: params.code } },
      ],
      revokedAt: null,
    },
    include: { app: true },
  });

  if (!link) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.redirect(new URL(`/d/${link.token}`, req.url));
}
