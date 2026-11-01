import { NextRequest } from "next/server";
import { DistributionService } from "@/server/services/distribution.service";
import { updateShareLinkSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ lid: string }> }
) {
  const params = await props.params;

  try {
    const body = await req.json();
    const parsed = updateShareLinkSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const updated = await DistributionService.updateShareLink(params.lid, parsed.data);
    return apiSuccess(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update link";
    return apiError("UPDATE_LINK_FAILED", message, 400);
  }
}
