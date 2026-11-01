import { NextRequest } from "next/server";
import { BuildService } from "@/server/services/build.service";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ uid: string }> }
) {
  const params = await props.params;
  const { searchParams } = new URL(req.url);
  const partNumberStr = searchParams.get("partNumber");
  const storageKey = searchParams.get("key");

  if (!partNumberStr || !storageKey) {
    return apiError("PARAMS_MISSING", "Both 'partNumber' and 'key' query params are required", 422);
  }

  const partNumber = parseInt(partNumberStr, 10);
  const partUrl = await BuildService.getPartUrl(storageKey, params.uid, partNumber);

  return apiSuccess({ partNumber, partUrl });
}
