import { NextRequest } from "next/server";
import { BuildService } from "@/server/services/build.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const a = searchParams.get("a");
  const b = searchParams.get("b");

  if (!a || !b) {
    return apiError("PARAMS_REQUIRED", "Query params 'a' and 'b' (build IDs) are required", 422);
  }

  try {
    const diff = await BuildService.compareBuilds(a, b);
    return apiSuccess(diff);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Comparison failed";
    return apiError("COMPARE_FAILED", message, 400);
  }
}
