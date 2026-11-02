import { z } from "zod";

// ---------------------------------------------------
// Auth Schemas
// ---------------------------------------------------

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  tosAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms of Service",
  }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
  code: z.string().optional(), // 2FA code if required
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Code must be 6 digits"),
});

export const resendOtpSchema = z.object({
  email: z.string().email(),
  purpose: z.enum(["signup", "login", "reset_password", "change_email"]).default("signup"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const verify2faSchema = z.object({
  code: z.string().min(6),
  isBackupCode: z.boolean().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/, "Alphanumeric, dashes, underscores only")
    .optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(250).optional(),
  website: z.string().url().optional(),
  locale: z.enum(["en", "hi"]).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const onboardingSchema = z.object({
  role: z.string().optional(),
  teamSize: z.string().optional(),
  primaryFramework: z.string().optional(),
});

// ---------------------------------------------------
// Workspaces & Teams Schemas
// ---------------------------------------------------

export const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Lowercase alphanumeric with dashes"),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  logoUrl: z.string().url().optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "developer", "viewer"]).default("developer"),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["admin", "developer", "viewer"]),
});

export const transferOwnershipSchema = z.object({
  newOwnerId: z.string().uuid(),
  password: z.string().min(1),
});

// ---------------------------------------------------
// Apps Schemas
// ---------------------------------------------------

export const createAppSchema = z.object({
  name: z.string().min(2).max(60),
  packageName: z
    .string()
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/, "Valid Android package name required"),
  slug: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Lowercase alphanumeric with dashes"),
  description: z.string().max(1000).optional(),
  visibility: z.enum(["public", "unlisted", "private"]).default("public"),
  developerUrl: z.string().url().optional(),
  privacyUrl: z.string().url().optional(),
  supportEmail: z.string().email().optional(),
});

export const updateAppSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  description: z.string().max(1000).optional(),
  visibility: z.enum(["public", "unlisted", "private"]).optional(),
  developerUrl: z.string().url().optional().nullable(),
  privacyUrl: z.string().url().optional().nullable(),
  supportEmail: z.string().email().optional().nullable(),
});

// ---------------------------------------------------
// Builds & Uploads Schemas
// ---------------------------------------------------

export const initUploadSchema = z.object({
  filename: z.string().regex(/\.apk$/i, "Must have .apk extension"),
  sizeBytes: z.number().positive(),
  contentType: z.string().default("application/vnd.android.package-archive"),
});

export const completeUploadSchema = z.object({
  parts: z
    .array(
      z.object({
        PartNumber: z.number().int().positive(),
        ETag: z.string().min(1),
      })
    )
    .optional(),
  versionName: z.string().optional(),
  versionCode: z.number().int().positive().optional(),
  releaseNotes: z.string().optional(),
  channel: z.string().default("production"),
});

export const updateBuildSchema = z.object({
  releaseNotes: z.string().max(5000).optional(),
  status: z.enum(["uploading", "processing", "scanning", "ready", "failed", "blocked"]).optional(),
});

// ---------------------------------------------------
// Channels & Versions Schemas
// ---------------------------------------------------

export const createChannelSchema = z.object({
  name: z.string().min(2).max(30).regex(/^[a-z0-9-]+$/),
});

export const promoteChannelSchema = z.object({
  buildId: z.string().uuid(),
});

export const updateRolloutSchema = z.object({
  rolloutPercent: z.number().int().min(5).max(100),
});

// ---------------------------------------------------
// Distribution & Share Links Schemas
// ---------------------------------------------------

export const createShareLinkSchema = z.object({
  buildId: z.string().uuid().optional(),
  type: z.enum(["build", "latest"]).default("build"),
  password: z.string().min(4).optional(),
  expiresAt: z.string().datetime().optional(),
  maxDownloads: z.number().int().positive().optional(),
  requiresLogin: z.boolean().default(false),
  allowedEmails: z.array(z.string().email()).optional(),
});

export const updateShareLinkSchema = z.object({
  password: z.string().min(4).optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  maxDownloads: z.number().int().positive().optional().nullable(),
  requiresLogin: z.boolean().optional(),
  allowedEmails: z.array(z.string().email()).optional().nullable(),
});

// ---------------------------------------------------
// Testers Schemas
// ---------------------------------------------------

export const inviteTesterSchema = z.object({
  email: z.string().email(),
  groupId: z.string().uuid().optional(),
});

export const bulkInviteTestersSchema = z.object({
  emails: z.array(z.string().email()).min(1).max(500),
  groupId: z.string().uuid().optional(),
});

export const createTesterGroupSchema = z.object({
  name: z.string().min(2).max(50),
});

export const submitTesterFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(3).max(2000),
  screenshotKey: z.string().optional(),
});

// ---------------------------------------------------
// Developer Tools (Tokens & Webhooks)
// ---------------------------------------------------

export const createApiTokenSchema = z.object({
  name: z.string().min(2).max(50),
  scopes: z.array(z.string()).min(1),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

export const createWebhookSchema = z.object({
  url: z.string().url().refine((url) => {
    // SSRF protection: reject local and private IPs
    const lower = url.toLowerCase();
    return !lower.includes("localhost") && !lower.includes("127.0.0.1") && !lower.includes("192.168.") && !lower.includes("10.");
  }, "URL must be publicly routable (SSRF protection)"),
  events: z.array(z.string()).min(1),
});

// ---------------------------------------------------
// Billing Schemas
// ---------------------------------------------------

export const checkoutSchema = z.object({
  plan: z.enum(["pro", "team", "enterprise"]),
  interval: z.enum(["monthly", "yearly"]).default("monthly"),
  provider: z.enum(["stripe", "razorpay"]).default("stripe"),
});

export const updateBillingDetailsSchema = z.object({
  companyName: z.string().optional(),
  gstin: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
});

export const applyCouponSchema = z.object({
  code: z.string().min(3).max(20),
});

// ---------------------------------------------------
// Public & Safety Schemas
// ---------------------------------------------------

export const abuseReportSchema = z.object({
  reason: z.string().min(3).max(100),
  details: z.string().max(2000).optional(),
  reporterEmail: z.string().email().optional(),
  captchaToken: z.string().optional(),
});

export const dmcaRequestSchema = z.object({
  claimantName: z.string().min(2),
  claimantEmail: z.string().email(),
  infringementDetails: z.string().min(20).max(5000),
});

export const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10).max(3000),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});
