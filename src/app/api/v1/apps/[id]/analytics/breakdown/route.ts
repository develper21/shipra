import { NextRequest } from "next/server";
import { AnalyticsService } from "@/server/services/analytics.service";
import { apiSuccess } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { searchParams } = new URL(req.url);
  const by = (searchParams.get("by") as "android" | "device" | "country" | "source") || "country";

  const breakdown = await AnalyticsService.getBreakdown(params.id, by);
  return apiSuccess(breakdown);
}
