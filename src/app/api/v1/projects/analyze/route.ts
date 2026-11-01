import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/server/lib/response";
import { ProjectAnalysisService } from "@/server/services/project-analysis.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { repoFullName, branch } = body;

    if (!repoFullName) {
      return apiError("BAD_REQUEST", "Repository name is required for analysis", 400);
    }

    const report = ProjectAnalysisService.analyzeRepository(repoFullName, branch || "main");
    return apiSuccess({
      success: true,
      report,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to analyze repository";
    return apiError("ERROR", message, 500);
  }
}
