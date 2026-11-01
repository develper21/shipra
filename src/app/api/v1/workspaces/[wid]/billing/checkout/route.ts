import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { BillingService } from "@/server/services/billing.service";
import { can } from "@/server/policies/rbac";
import { checkoutSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user || !can(user, "billing:manage")) {
    return apiError("FORBIDDEN", "Only workspace owner can initiate billing checkouts", 403);
  }

  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const session = await BillingService.createCheckout(
      params.wid,
      parsed.data.plan,
      parsed.data.provider
    );

    return apiSuccess(session);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout initialization failed";
    return apiError("CHECKOUT_FAILED", message, 400);
  }
}
