import { NextRequest } from "next/server";
import { BuildService } from "@/server/services/build.service";
import { completeUploadSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ uid: string }> }
) {
  const params = await props.params;
  const { searchParams } = new URL(req.url);
  const appId = searchParams.get("appId");
  const storageKey = searchParams.get("key");

  if (!appId || !storageKey) {
    return apiError("PARAMS_MISSING", "Both 'appId' and 'key' query params are required", 422);
  }

  try {
    const body = await req.json();
    const parsed = completeUploadSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const build = await BuildService.completeUpload(appId, {
      uploadId: params.uid,
      storageKey,
      parts: parsed.data.parts,
      versionName: parsed.data.versionName,
      versionCode: parsed.data.versionCode,
      releaseNotes: parsed.data.releaseNotes,
      channel: parsed.data.channel,
    });

    return apiSuccess(build, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to complete upload";
    return apiError("COMPLETE_UPLOAD_FAILED", message, 400);
  }
}
