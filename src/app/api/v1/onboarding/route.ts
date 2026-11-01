import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { apiSuccess, apiError } from "@/server/lib/response";
import { prisma } from "@/server/db/prisma";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);

  // If not logged in, we can still return a default guest onboarding state
  const userId = user?.id || "guest";
  const userEmail = user?.email || "developer@example.com";
  const userName = user?.name || "Developer";

  // Check if user has an existing workspace in db
  let userWorkspace = null;
  if (user) {
    userWorkspace = await prisma.workspace.findFirst({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  const defaultState = {
    workspaceId: userWorkspace?.id || undefined,
    workspaceName: userWorkspace?.name || `${userName}'s Workspace`,
    workspaceSlug: userWorkspace?.slug || `${userName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-workspace`,
    companyName: "",
    status: "in_progress",
    currentStep: "welcome",
    stepNumber: 1,
    totalSteps: 7,
    steps: {
      welcome: "in_progress",
      profile_workspace: userWorkspace ? "completed" : "not_started",
      role_goal: "not_started",
      connect_provider: "not_started",
      choose_start: "not_started",
      invite_team: "not_started",
      setup_complete: "not_started",
    },
    answers: {
      fullName: userName,
      role: "",
      primaryGoal: "",
      teamSize: "1-5",
    },
    provider: {
      connected: false,
      providerName: undefined,
      accountName: undefined,
      scope: undefined,
    },
    startingPoint: {
      type: undefined,
      repository: undefined,
      branch: undefined,
      framework: undefined,
    },
    teamInvites: [],
    onboardingCompletedAt: null,
  };

  return apiSuccess(defaultState);
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const body = await req.json();

    // If updating workspace name/slug and user is authenticated, update or create workspace
    let workspaceId = body.workspaceId;
    if (user && body.workspaceName && body.workspaceSlug) {
      const existing = await prisma.workspace.findFirst({
        where: {
          OR: [
            { id: workspaceId || "" },
            { slug: body.workspaceSlug.toLowerCase() },
          ],
        },
      });

      if (!existing) {
        const created = await prisma.workspace.create({
          data: {
            name: body.workspaceName,
            slug: body.workspaceSlug.toLowerCase(),
            type: "personal",
            ownerId: user.id,
            planId: "free",
            memberships: {
              create: {
                userId: user.id,
                role: "owner",
              },
            },
          },
        });
        workspaceId = created.id;
      } else {
        workspaceId = existing.id;
      }
    }

    return apiSuccess({
      success: true,
      workspaceId,
      state: body,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to persist onboarding progress";
    return apiError("ERROR", message, 400);
  }
}
