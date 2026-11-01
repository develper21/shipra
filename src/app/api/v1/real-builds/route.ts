import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/server/lib/response";
import { RealBuildService } from "@/server/services/real-build.service";

export async function GET() {
  const builds = RealBuildService.getBuilds();
  return apiSuccess({ builds });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newBuild = RealBuildService.createBuildJob(body);
    return apiSuccess({ success: true, build: newBuild });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create build job";
    return apiError("ERROR", message, 500);
  }
}
