import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/server/lib/response";
import { RealDistributionService } from "@/server/services/real-distribution.service";
import { RealBuildService } from "@/server/services/real-build.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const build = RealBuildService.getBuildById(id);

  if (!build) {
    return apiError("NOT_FOUND", `Build ${id} not found`, 404);
  }

  const body = await req.json().catch(() => ({}));
  const distribution = RealDistributionService.createDistribution({
    buildId: id,
    projectId: build.projectId,
    projectName: build.projectName,
    method: body.method || "android_direct_download",
    accessMode: body.accessMode || "link",
    expiresInDays: body.expiresInDays,
  });

  return apiSuccess({ success: true, distribution });
}
