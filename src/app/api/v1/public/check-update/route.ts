import { NextRequest } from "next/server";
import { DeveloperService } from "@/server/services/developer.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const packageName = searchParams.get("package");
  const versionCodeStr = searchParams.get("versionCode");
  const channel = searchParams.get("channel") || "production";

  if (!packageName || !versionCodeStr) {
    return apiError("PARAMS_REQUIRED", "Both 'package' and 'versionCode' query params are required", 422);
  }

  const versionCode = parseInt(versionCodeStr, 10);
  const result = await DeveloperService.checkInAppUpdate(packageName, versionCode, channel);

  return apiSuccess(result, undefined, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
