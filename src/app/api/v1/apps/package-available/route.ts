import { NextRequest } from "next/server";
import { AppService } from "@/server/services/app.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const packageName = searchParams.get("package");

  if (!packageName) {
    return apiError("PACKAGE_REQUIRED", "Query param 'package' is required", 422);
  }

  const available = await AppService.isPackageAvailable(packageName);
  return apiSuccess({ packageName, available });
}
