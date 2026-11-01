import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { TesterService } from "@/server/services/tester.service";
import { AppService } from "@/server/services/app.service";
import { can } from "@/server/policies/rbac";
import { inviteTesterSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const app = await AppService.getApp(params.id);
  if (!app) return apiError("NOT_FOUND", "App not found", 404);

  const testers = await TesterService.listTesters(params.id);
  return apiSuccess(testers);
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const app = await AppService.getApp(params.id);
  if (!app) return apiError("NOT_FOUND", "App not found", 404);

  const user = await getAuthUser(req, app.workspaceId);
  if (!user || !can(user, "tester:manage")) {
    return apiError("FORBIDDEN", "Insufficient permissions to manage testers", 403);
  }

  try {
    const body = await req.json();
    const parsed = inviteTesterSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const tester = await TesterService.inviteTester(params.id, parsed.data.email, parsed.data.groupId);
    return apiSuccess(tester, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to invite tester";
    return apiError("INVITE_TESTER_FAILED", message, 400);
  }
}
