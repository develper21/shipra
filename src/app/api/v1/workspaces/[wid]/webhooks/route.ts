import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { DeveloperService } from "@/server/services/developer.service";
import { can } from "@/server/policies/rbac";
import { createWebhookSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user || !can(user, "developer:webhook_manage")) {
    return apiError("FORBIDDEN", "Insufficient permissions to manage webhooks", 403);
  }

  const webhooks = await DeveloperService.listWebhooks(params.wid);
  return apiSuccess(webhooks);
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user || !can(user, "developer:webhook_manage")) {
    return apiError("FORBIDDEN", "Insufficient permissions to create webhooks", 403);
  }

  try {
    const body = await req.json();
    const parsed = createWebhookSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const result = await DeveloperService.createWebhook(
      params.wid,
      parsed.data.url,
      parsed.data.events
    );

    return apiSuccess(result, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create webhook";
    return apiError("WEBHOOK_CREATE_FAILED", message, 400);
  }
}
