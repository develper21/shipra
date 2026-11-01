import { NextRequest } from "next/server";
import { DistributionService } from "@/server/services/distribution.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ lid: string }> }
) {
  const params = await props.params;

  try {
    const updated = await DistributionService.rotateToken(params.lid);
    return apiSuccess({ success: true, token: updated.token, url: `/d/${updated.token}` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to rotate token";
    return apiError("ROTATE_FAILED", message, 400);
  }
}
