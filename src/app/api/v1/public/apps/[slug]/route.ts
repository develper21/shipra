import { NextRequest } from "next/server";
import { AppService } from "@/server/services/app.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const app = await AppService.getApp(params.slug);

  if (!app) {
    return apiError("NOT_FOUND", "App not found", 404);
  }

  if (app.visibility === "private") {
    return apiError("PRIVATE_APP", "This app is private and requires an invite or login", 403);
  }

  const latestBuild = app.builds[0]
    ? {
        ...app.builds[0],
        sizeBytes: Number(app.builds[0].sizeBytes),
      }
    : null;

  return apiSuccess({
    id: app.id,
    name: app.name,
    slug: app.slug,
    packageName: app.packageName,
    description: app.description,
    iconKey: app.iconKey,
    visibility: app.visibility,
    developerUrl: app.developerUrl,
    privacyUrl: app.privacyUrl,
    supportEmail: app.supportEmail,
    screenshots: app.screenshots,
    latestBuild,
    workspace: app.workspace,
  });
}
