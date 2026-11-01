import { NextRequest } from "next/server";
import { prisma } from "@/server/db/prisma";
import { apiSuccess, apiError } from "@/server/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const results = await prisma.scanResult.findMany({
    where: { buildId: params.id },
  });

  return apiSuccess(results);
}
