import { BillingService } from "@/server/services/billing.service";
import { apiSuccess } from "@/server/lib/response";

export async function GET() {
  const plans = await BillingService.listPlans();
  return apiSuccess(
    plans.map((p) => ({
      ...p,
      storageBytesLimit: Number(p.storageBytesLimit),
      bandwidthBytesLimit: Number(p.bandwidthBytesLimit),
    }))
  );
}
