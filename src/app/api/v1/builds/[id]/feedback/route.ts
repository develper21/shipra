import { NextRequest } from "next/server";
import { getAuthUser } from "@/server/middleware/auth";
import { TesterService } from "@/server/services/tester.service";
import { submitTesterFeedbackSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const feedback = await TesterService.listBuildFeedback(params.id);
  return apiSuccess(feedback);
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const user = await getAuthUser(req);

  try {
    const body = await req.json();
    const parsed = submitTesterFeedbackSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const result = await TesterService.submitFeedback(params.id, {
      testerId: user?.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      screenshotKey: parsed.data.screenshotKey,
    });

    return apiSuccess(result, undefined, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit feedback";
    return apiError("FEEDBACK_FAILED", message, 400);
  }
}
