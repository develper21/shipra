import { NextRequest } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hashToken } from "@/server/lib/crypto";
import { AuthContext } from "@/server/policies/rbac";

export interface AuthenticatedUser extends AuthContext {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  status: "active" | "suspended" | "banned";
  role: "user" | "admin";
  locale: string;
  workspaceRole?: "owner" | "admin" | "developer" | "viewer";
}

/**
 * Extracts and verifies the user from Session Cookie or Bearer API Token
 */
export async function getAuthUser(
  req: NextRequest,
  workspaceId?: string
): Promise<AuthenticatedUser | null> {
  const authHeader = req.headers.get("Authorization");
  const sessionCookie = req.cookies.get("applaunch_session")?.value;

  try {
    // 1. Try Bearer API Token (CLI / CI)
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const rawToken = authHeader.substring(7).trim();
      const tokenHash = hashToken(rawToken);

      const apiToken = await prisma.apiToken.findUnique({
        where: { tokenHash },
        include: {
          user: true,
          workspace: true,
        },
      });

      if (
        apiToken &&
        !apiToken.revokedAt &&
        (!apiToken.expiresAt || apiToken.expiresAt > new Date())
      ) {
        // Update lastUsedAt asynchronously
        prisma.apiToken
          .update({
            where: { id: apiToken.id },
            data: { lastUsedAt: new Date() },
          })
          .catch(() => {});

        // Fetch user membership for this workspace
        const membership = await prisma.membership.findUnique({
          where: {
            workspaceId_userId: {
              workspaceId: workspaceId || apiToken.workspaceId,
              userId: apiToken.userId,
            },
          },
        });

        return {
          id: apiToken.user.id,
          email: apiToken.user.email,
          name: apiToken.user.name,
          username: apiToken.user.username,
          avatarUrl: apiToken.user.avatarUrl,
          status: apiToken.user.status,
          role: apiToken.user.role,
          locale: apiToken.user.locale,
          workspaceRole: membership?.role,
          scopes: Array.isArray(apiToken.scopes)
            ? (apiToken.scopes as string[])
            : [],
        };
      }
    }

    // 2. Try Session Cookie (Web)
    if (sessionCookie) {
      const tokenHash = hashToken(sessionCookie);

      const session = await prisma.session.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (session && session.expiresAt > new Date()) {
        // Touch last active time
        prisma.session
          .update({
            where: { id: session.id },
            data: { lastActiveAt: new Date() },
          })
          .catch(() => {});

        let workspaceRole: "owner" | "admin" | "developer" | "viewer" | undefined = undefined;

        if (workspaceId) {
          const membership = await prisma.membership.findUnique({
            where: {
              workspaceId_userId: {
                workspaceId,
                userId: session.user.id,
              },
            },
          });
          workspaceRole = membership?.role;
        }

        return {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          username: session.user.username,
          avatarUrl: session.user.avatarUrl,
          status: session.user.status,
          role: session.user.role,
          locale: session.user.locale,
          workspaceRole,
        };
      }
    }
  } catch (err) {
    // Graceful handling if DB is connecting
    console.error("Auth extraction error:", err);
  }

  // Fallback demo/development session if database is not yet migrated
  if (process.env.NODE_ENV === "development" && sessionCookie === "demo_session_active") {
    return {
      id: "usr_mock_dev_01",
      email: "alex@applaunch.dev",
      name: "Alex Dev",
      username: "alexdev",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      status: "active",
      role: "admin",
      locale: "en",
      workspaceRole: "owner",
    };
  }

  return null;
}
