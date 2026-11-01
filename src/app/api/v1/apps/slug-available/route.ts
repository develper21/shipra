import { NextRequest } from "next/server";
import { AppService } from "@/server/services/app.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return apiError("SLUG_REQUIRED", "Query param 'slug' is required", 422);
  }

  const available = await AppService.isSlugAvailable(slug);
  return apiSuccess({ slug, available });
}
