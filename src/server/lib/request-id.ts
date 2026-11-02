import crypto from "crypto";

export function generateRequestId(): string {
  return `req_${crypto.randomBytes(12).toString("hex")}`;
}

export function getRequestIdFromHeader(headers: Headers): string {
  return headers.get("X-Request-Id") || generateRequestId();
}
