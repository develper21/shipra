import { NextRequest } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hashIp } from "@/server/lib/crypto";
import { abuseReportSchema } from "@/server/validators";
import { checkRateLimit } from "@/server/lib/rate-limit";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const ip = req.headers.get("x-forwarded-for") || "unknown_ip";

  const rate = checkRateLimit(`report:${ip}`, 3, 300); // 3 reports per 5 mins
  if (!rate.success) {
    return apiError("RATE_LIMIT", "Too many reports submitted. Please wait a few minutes.", 429);
  }

  const app = await prisma.app.findUnique({
    where: { slug: params.slug },
  });

  if (!app) return apiError("NOT_FOUND", "App not found", 404);

  try {
    const body = await req.json();
    const parsed = abuseReportSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const report = await prisma.abuseReport.create({
      data: {
        appId: app.id,
        reason: parsed.data.reason,
        details: parsed.data.details,
        reporterEmail: parsed.data.reporterEmail,
        reporterIpHash: hashIp(ip),
      },
    });

    return apiSuccess({
      success: true,
      reportId: report.id,
      message: "Report received and queued for review",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit report";
    return apiError("REPORT_FAILED", message, 400);
  }
}
