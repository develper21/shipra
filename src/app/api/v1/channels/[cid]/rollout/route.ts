import { NextRequest } from "next/server";
import { ChannelService } from "@/server/services/channel.service";
import { updateRolloutSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ cid: string }> }
) {
  const params = await props.params;

  try {
    const body = await req.json();
    const parsed = updateRolloutSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const result = await ChannelService.updateRollout(params.cid, parsed.data.rolloutPercent);
    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update rollout";
    return apiError("ROLLOUT_UPDATE_FAILED", message, 400);
  }
}
