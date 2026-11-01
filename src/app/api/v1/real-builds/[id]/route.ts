import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/server/lib/response";
import { RealBuildService } from "@/server/services/real-build.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const build = RealBuildService.getBuildById(id);

  if (!build) {
    return apiError("NOT_FOUND", `Build ${id} not found`, 404);
  }

  return apiSuccess({ build });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const stageIndex = typeof body.stageIndex === "number" ? body.stageIndex : 0;

  const updated = RealBuildService.advanceBuildStage(id, stageIndex);
  if (!updated) {
    return apiError("NOT_FOUND", `Build ${id} not found`, 404);
  }

  return apiSuccess({ success: true, build: updated });
}
