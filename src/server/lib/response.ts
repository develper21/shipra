import { NextResponse } from "next/server";
import { generateRequestId } from "@/server/lib/request-id";

export interface ApiSuccessMeta {
  nextCursor?: string | null;
  total?: number;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export function apiSuccess<T>(
  data: T,
  meta?: ApiSuccessMeta,
  init?: { status?: number; headers?: HeadersInit; requestId?: string }
) {
  const reqId = init?.requestId || generateRequestId();
  const headers = new Headers(init?.headers);
  headers.set("X-Request-Id", reqId);

  return NextResponse.json(
    {
      data,
      ...(meta ? { meta } : {}),
    },
    {
      status: init?.status || 200,
      headers,
    }
  );
}

export function apiError(
  code: string,
  message: string,
  status = 400,
  details: unknown = null,
  init?: { headers?: HeadersInit; requestId?: string }
) {
  const reqId = init?.requestId || generateRequestId();
  const headers = new Headers(init?.headers);
  headers.set("X-Request-Id", reqId);

  return NextResponse.json(
    {
      error: {
        code,
        message,
        details,
        requestId: reqId,
      },
    },
    {
      status,
      headers,
    }
  );
}

export function apiValidationError(details: unknown, requestId?: string) {
  return apiError(
    "VALIDATION_ERROR",
    "The request payload failed validation checks.",
    422,
    details,
    { requestId }
  );
}
