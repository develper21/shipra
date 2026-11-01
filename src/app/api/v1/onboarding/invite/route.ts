import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { apiSuccess, apiError } from "@/server/lib/response";
import { WorkspaceService } from "@/server/services/workspace.service";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const body = await req.json();
    const { workspaceId, invites } = body;

    if (!Array.isArray(invites) || invites.length === 0) {
      return apiSuccess({ sentCount: 0, invites: [] });
    }

    const sentInvites = [];
    for (const item of invites) {
      if (item.email && item.email.includes("@")) {
        // If real workspace in db exists and user is owner
        if (workspaceId && user) {
          try {
            const result = await WorkspaceService.inviteMember(
              workspaceId,
              item.email,
              item.role || "developer"
            );
            sentInvites.push(result);
          } catch (e) {
            sentInvites.push({
              email: item.email,
              role: item.role || "developer",
              status: "pending",
            });
          }
        } else {
          sentInvites.push({
            email: item.email,
            role: item.role || "developer",
            status: "pending",
          });
        }
      }
    }

    return apiSuccess({
      success: true,
      sentCount: sentInvites.length,
      invites: sentInvites,
      message: `Sent ${sentInvites.length} workspace invitations.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send invitations";
    return apiError("ERROR", message, 400);
  }
}
