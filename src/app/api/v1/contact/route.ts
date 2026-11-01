import { NextRequest } from "next/server";
import { prisma } from "@/server/db/prisma";
import { contactFormSchema } from "@/server/validators";
import { checkRateLimit } from "@/server/lib/rate-limit";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown_ip";
  const rate = checkRateLimit(`contact:${ip}`, 5, 300);

  if (!rate.success) {
    return apiError("RATE_LIMIT", "Too many messages sent. Please wait a few minutes.", 429);
  }

  try {
    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    const message = await prisma.contactMessage.create({
      data: parsed.data,
    });

    return apiSuccess({
      success: true,
      id: message.id,
      message: "Your message has been received. Our team will get back to you shortly.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit message";
    return apiError("SUBMIT_FAILED", message, 400);
  }
}
