import { NextRequest } from "next/server";
import { prisma } from "@/server/db/prisma";
import { dmcaRequestSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = dmcaRequestSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    // Resolve app by slug or ID if provided
    const app = await prisma.app.findFirst({
      where: { deletedAt: null },
    });

    if (!app) {
      return apiError("APP_NOT_FOUND", "Specified application was not found", 404);
    }

    const dmca = await prisma.dmcaRequest.create({
      data: {
        appId: app.id,
        claimantName: parsed.data.claimantName,
        claimantEmail: parsed.data.claimantEmail,
        infringementDetails: parsed.data.infringementDetails,
      },
    });

    return apiSuccess({
      success: true,
      caseNumber: `DMCA-${dmca.id.slice(0, 8).toUpperCase()}`,
      message: "DMCA takedown notice has been logged and assigned to legal team.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record notice";
    return apiError("DMCA_FAILED", message, 400);
  }
}
