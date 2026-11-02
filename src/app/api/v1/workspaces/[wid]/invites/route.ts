import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { WorkspaceService } from "@/server/services/workspace.service";
import { can } from "@/server/policies/rbac";
import { inviteMemberSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";
import { prisma } from "@/server/db/prisma";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  if (!can(user, "member:invite")) {
    return apiError("FORBIDDEN", "Admin rights required to view pending invites", 403);
  }

  const invites = await prisma.invite.findMany({
    where: { workspaceId: params.wid, acceptedAt: null, expiresAt: { gt: new Date() } },
    select: { id: true, email: true, role: true, expiresAt: true, createdAt: true },
  });

  return apiSuccess(invites);
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  if (!can(user, "member:invite")) {
    return apiError("FORBIDDEN", "Admin rights required to invite members", 403);
  }

  try {
    const body = await req.json();
    const parsed = inviteMemberSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const result = await WorkspaceService.inviteMember(params.wid, parsed.data.email, parsed.data.role);
    return apiSuccess(result, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to invite member";
    return apiError("INVITE_FAILED", message, 400);
  }
}
