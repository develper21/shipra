import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/server/lib/response";
import { RealDeploymentService } from "@/server/services/real-deployment.service";
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
  const deployment = RealDeploymentService.createDeployment({
    buildId: id,
    projectId: build.projectId,
    projectName: build.projectName,
    destination: body.destination || "google_play",
    track: body.track || "internal",
    releaseNotes: body.releaseNotes || "Automated release build submission from Shipra",
  });

  return apiSuccess({ success: true, deployment });
}
