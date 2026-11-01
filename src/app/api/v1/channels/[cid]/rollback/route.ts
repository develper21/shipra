import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { ChannelService } from "@/server/services/channel.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ cid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req);

  try {
    const result = await ChannelService.rollbackChannel(params.cid, user?.id);
    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to rollback channel";
    return apiError("ROLLBACK_FAILED", message, 400);
  }
}
