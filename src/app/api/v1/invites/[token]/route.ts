import { NextRequest } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hashToken } from "@/server/lib/crypto";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ token: string }> }
) {
  const params = await props.params;
  const tokenHash = hashToken(params.token);

  const invite = await prisma.invite.findFirst({
    where: {
      tokenHash,
      acceptedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      workspace: { select: { id: true, name: true, slug: true, logoUrl: true } },
    },
  });

  if (!invite) {
    return apiError("INVITE_NOT_FOUND", "This invite has expired or is invalid", 404);
  }

  return apiSuccess({
    email: invite.email,
    role: invite.role,
    workspace: invite.workspace,
    expiresAt: invite.expiresAt,
  });
}
