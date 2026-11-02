import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { DeveloperService } from "@/server/services/developer.service";
import { can } from "@/server/policies/rbac";
import { createApiTokenSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user || !can(user, "developer:token_manage")) {
    return apiError("FORBIDDEN", "Insufficient permissions to view API tokens", 403);
  }

  const tokens = await DeveloperService.listTokens(params.wid);
  return apiSuccess(tokens);
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ wid: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req, params.wid);
  if (!user || !can(user, "developer:token_manage")) {
    return apiError("FORBIDDEN", "Insufficient permissions to create API tokens", 403);
  }

  try {
    const body = await req.json();
    const parsed = createApiTokenSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const result = await DeveloperService.createToken(
      params.wid,
      user.id,
      parsed.data.name,
      parsed.data.scopes,
      parsed.data.expiresInDays
    );

    return apiSuccess(result, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create token";
    return apiError("TOKEN_CREATE_FAILED", message, 400);
  }
}
