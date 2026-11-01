import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { BillingService } from "@/server/services/billing.service";
import { can } from "@/server/policies/rbac";
import { updateBillingDetailsSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user || !can(user, "billing:manage")) {
    return apiError("FORBIDDEN", "Only workspace owner can update billing details", 403);
  }

  try {
    const body = await req.json();
    const parsed = updateBillingDetailsSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const result = await BillingService.updateBillingDetails(params.wid, parsed.data);
    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update billing details";
    return apiError("UPDATE_FAILED", message, 400);
  }
}
