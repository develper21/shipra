import { NextRequest } from "next/server";
import { DistributionService } from "@/server/services/distribution.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ lid: string }> }
) {
  const params = await props.params;

  try {
    const revoked = await DistributionService.revokeLink(params.lid);
    return apiSuccess({ success: true, revokedAt: revoked.revokedAt });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to revoke link";
    return apiError("REVOKE_FAILED", message, 400);
  }
}
