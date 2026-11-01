import { NextRequest } from "next/server";
import { prisma } from "@/server/db/prisma";
import { newsletterSchema } from "@/server/validators";
import { apiSuccess, apiError, apiValidationError } from "@/server/lib/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.flatten());

    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      create: {
        email: parsed.data.email.toLowerCase(),
        status: "active",
        confirmedAt: new Date(),
      },
      update: { status: "active" },
    });

    return apiSuccess({ success: true, message: "Thank you for subscribing!" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to subscribe";
    return apiError("SUBSCRIBE_FAILED", message, 400);
  }
}
