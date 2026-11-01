import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { ChannelService } from "@/server/services/channel.service";
import { AppService } from "@/server/services/app.service";
import { can } from "@/server/policies/rbac";
import { createChannelSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const app = await AppService.getApp(params.id);
  if (!app) return apiError("NOT_FOUND", "App not found", 404);

  const channels = await ChannelService.getChannels(params.id);
  return apiSuccess(channels);
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const app = await AppService.getApp(params.id);
  if (!app) return apiError("NOT_FOUND", "App not found", 404);

  const user = await getAuthUser(req, app.workspaceId);
  if (!user || !can(user, "channel:create")) {
    return apiError("FORBIDDEN", "Admin permissions required to create custom channels", 403);
  }

  try {
    const body = await req.json();
    const parsed = createChannelSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const channel = await ChannelService.createChannel(params.id, parsed.data.name);
    return apiSuccess(channel, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create channel";
    return apiError("CREATE_CHANNEL_FAILED", message, 400);
  }
}
