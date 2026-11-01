import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { ChannelService } from "@/server/services/channel.service";
import { promoteChannelSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ cid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req);

  try {
    const body = await req.json();
    const parsed = promoteChannelSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const result = await ChannelService.promoteBuild(
      params.cid,
      parsed.data.buildId,
      user?.id
    );

    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to promote build";
    return apiError("PROMOTE_FAILED", message, 400);
  }
}
