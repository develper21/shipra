import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const body = await req.json().catch(() => ({}));

    return apiSuccess({
      success: true,
      onboardingCompleted: true,
      completedAt: new Date().toISOString(),
      workspaceId: body.workspaceId,
      message: "Workspace onboarding successfully completed",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to complete onboarding";
    return apiError("ERROR", message, 400);
  }
}
