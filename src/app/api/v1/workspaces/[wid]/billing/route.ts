import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { BillingService } from "@/server/services/billing.service";
import { can } from "@/server/policies/rbac";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user || !can(user, "billing:read")) {
    return apiError("FORBIDDEN", "Insufficient permissions to view billing", 403);
  }

  const billing = await BillingService.getWorkspaceBilling(params.wid);
  return apiSuccess({
    ...billing,
    plan: {
      ...billing.plan,
      storageBytesLimit: Number(billing.plan.storageBytesLimit),
      bandwidthBytesLimit: Number(billing.plan.bandwidthBytesLimit),
    },
  });
}
