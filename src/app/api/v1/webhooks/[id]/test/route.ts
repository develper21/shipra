import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { DeveloperService } from "@/server/services/developer.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req);
  if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);

  const result = await DeveloperService.testWebhook(params.id);
  return apiSuccess(result);
}
