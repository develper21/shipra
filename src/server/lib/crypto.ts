import crypto from "crypto";
import bcrypt from "bcryptjs";

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY ||
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"; // 32 bytes hex
const IP_SALT = process.env.IP_HASH_SALT || "applaunch_default_ip_hash_salt_2026";

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify password with constant time comparison
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * AES-256-GCM Encryption for sensitive fields
 */
export function encryptData(text: string): string {
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), "hex");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  // Format: iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * AES-256-GCM Decryption
 */
export function decryptData(encryptedPayload: string): string {
  try {
    const [ivHex, authTagHex, encryptedHex] = encryptedPayload.split(":");
    if (!ivHex || !authTagHex || !encryptedHex) return "";

    const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), "hex");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    return "";
  }
}

/**
 * Hash raw IP address with salted SHA-256 for privacy compliance (DPDP/GDPR)
 */
export function hashIp(ip: string | null | undefined): string {
  if (!ip) return "ip_unknown";
  return crypto.createHash("sha256").update(`${ip}:${IP_SALT}`).digest("hex");
}

/**
 * Hash token (for sessions, invites, and api tokens)
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Generate secure API token with prefix
 */
export function generateApiToken(prefix = "apl_live"): { token: string; hash: string; preview: string } {
  const rawBytes = crypto.randomBytes(24).toString("hex");
  const token = `${prefix}_${rawBytes}`;
  const hash = hashToken(token);
  const preview = `${token.slice(0, 12)}...${token.slice(-4)}`;
  return { token, hash, preview };
}

/**
 * Generate numeric OTP
 */
export function generateOtp(length = 6): string {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10).toString();
  }
  return otp;
}

/**
 * HMAC-SHA256 signature for webhooks
 */
export function signWebhookPayload(payload: string, secret: string, timestamp: number): string {
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  return `t=${timestamp},v1=${signature}`;
}

/**
 * Simple password strength tester
 */
export function checkPasswordStrength(password: string): { score: number; feedback: string[] } {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 1;
  else feedback.push("Password must be at least 8 characters");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Add at least one uppercase letter");

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("Add at least one number");

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push("Add at least one special character");

  if (password.length >= 14) score += 1;

  return { score: Math.min(score, 4), feedback };
}
