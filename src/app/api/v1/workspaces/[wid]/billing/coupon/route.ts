import { NextRequest } from "next/server";
import { BillingService } from "@/server/services/billing.service";
import { applyCouponSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = applyCouponSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const result = await BillingService.applyCoupon(parsed.data.code);
    return apiSuccess(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid coupon code";
    return apiError("INVALID_COUPON", message, 400);
  }
}
