import { NextRequest } from "next/server";
import { AnalyticsService } from "@/server/services/analytics.service";
import { apiSuccess } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const summary = await AnalyticsService.getSummary(params.id);
  return apiSuccess(summary);
}
