import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { WorkspaceService } from "@/server/services/workspace.service";
import { createWorkspaceSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", 401);
  }

  const workspaces = await WorkspaceService.getUserWorkspaces(user.id);
  return apiSuccess(workspaces);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", 401);
  }

  try {
    const body = await req.json();
    const parsed = createWorkspaceSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const workspace = await WorkspaceService.createWorkspace(user.id, parsed.data);
    return apiSuccess(workspace, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create workspace";
    return apiError("WORKSPACE_CREATE_FAILED", message, 400);
  }
}
