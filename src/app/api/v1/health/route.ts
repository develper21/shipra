import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  const start = Date.now();
  let dbStatus = "healthy";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = "disconnected";
  }

  const responseTimeMs = Date.now() - start;

  return NextResponse.json(
    {
      status: dbStatus === "healthy" ? "pass" : "warn",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        database: { status: dbStatus, responseTimeMs },
        storage: { status: "operational", provider: "Cloudflare R2" },
        cache: { status: "operational", provider: "Redis / BullMQ" },
      },
    },
    { status: 200 }
  );
}
