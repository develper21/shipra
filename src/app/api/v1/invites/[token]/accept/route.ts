import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { WorkspaceService } from "@/server/services/workspace.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ token: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req);
  if (!user) {
    return apiError("UNAUTHORIZED", "Please sign in to accept this workspace invitation", 401);
  }

  try {
    const result = await WorkspaceService.acceptInvite(params.token, user.id);
    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to accept invite";
    return apiError("ACCEPT_FAILED", message, 400);
  }
}
