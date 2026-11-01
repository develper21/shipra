import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { TesterService } from "@/server/services/tester.service";
import { AppService } from "@/server/services/app.service";
import { can } from "@/server/policies/rbac";
import { bulkInviteTestersSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

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
    const parsed = bulkInviteTestersSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const result = await TesterService.bulkInvite(
      params.id,
      parsed.data.emails,
      parsed.data.groupId
    );

    return apiSuccess(result, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to bulk invite testers";
    return apiError("BULK_INVITE_FAILED", message, 400);
  }
}
