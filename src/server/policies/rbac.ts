import { MemberRole, UserRole } from "@prisma/client";

export type RbacAction =
  | "workspace:read"
  | "workspace:update"
  | "workspace:delete"
  | "workspace:transfer"
  | "member:read"
  | "member:invite"
  | "member:update_role"
  | "member:remove"
  | "app:read"
  | "app:create"
  | "app:update"
  | "app:delete"
  | "app:archive"
  | "build:read"
  | "build:upload"
  | "build:publish"
  | "build:delete"
  | "build:rescan"
  | "channel:read"
  | "channel:create"
  | "channel:update"
  | "channel:promote"
  | "channel:rollback"
  | "link:read"
  | "link:create"
  | "link:update"
  | "link:revoke"
  | "tester:read"
  | "tester:manage"
  | "analytics:read"
  | "developer:token_manage"
  | "developer:webhook_manage"
  | "billing:read"
  | "billing:manage"
  | "audit:read"
  | "admin:access";

const ROLE_RANK: Record<MemberRole, number> = {
  viewer: 1,
  developer: 2,
  admin: 3,
  owner: 4,
};

const ACTION_MIN_ROLE: Record<RbacAction, MemberRole | null> = {
  "workspace:read": "viewer",
  "workspace:update": "admin",
  "workspace:delete": "owner",
  "workspace:transfer": "owner",
  "member:read": "viewer",
  "member:invite": "admin",
  "member:update_role": "admin",
  "member:remove": "admin",
  "app:read": "viewer",
  "app:create": "developer",
  "app:update": "developer",
  "app:delete": "admin",
  "app:archive": "admin",
  "build:read": "viewer",
  "build:upload": "developer",
  "build:publish": "developer",
  "build:delete": "developer",
  "build:rescan": "admin",
  "channel:read": "viewer",
  "channel:create": "admin",
  "channel:update": "admin",
  "channel:promote": "developer",
  "channel:rollback": "developer",
  "link:read": "viewer",
  "link:create": "developer",
  "link:update": "developer",
  "link:revoke": "developer",
  "tester:read": "developer",
  "tester:manage": "developer",
  "analytics:read": "viewer",
  "developer:token_manage": "developer",
  "developer:webhook_manage": "admin",
  "billing:read": "admin",
  "billing:manage": "owner",
  "audit:read": "admin",
  "admin:access": null, // SysAdmin only
};

export interface AuthContext {
  id: string;
  email: string;
  role: UserRole;
  workspaceRole?: MemberRole;
  scopes?: string[];
}

export function can(
  auth: AuthContext | null | undefined,
  action: RbacAction,
  targetWorkspaceRole?: MemberRole | null
): boolean {
  if (!auth) return false;

  // Platform SysAdmin has superuser rights
  if (auth.role === "admin") return true;

  if (action === "admin:access") return false;

  const minRole = ACTION_MIN_ROLE[action];
  if (!minRole) return false;

  const effectiveRole = targetWorkspaceRole || auth.workspaceRole;
  if (!effectiveRole) return false;

  return ROLE_RANK[effectiveRole] >= ROLE_RANK[minRole];
}

export function assertCan(
  auth: AuthContext | null | undefined,
  action: RbacAction,
  targetWorkspaceRole?: MemberRole | null
): void {
  if (!can(auth, action, targetWorkspaceRole)) {
    throw new Error(`FORBIDDEN: You do not have permission to perform ${action}`);
  }
}
