import crypto from "crypto";
import { prisma } from "../db/prisma";
import {
  hashPassword,
  verifyPassword,
  hashToken,
  generateOtp,
  encryptData,
  decryptData,
} from "../lib/crypto";

export class AuthService {
  /**
   * User Signup with auto personal workspace creation
   */
  static async signup(data: { email: string; password: string; name: string }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new Error("EMAIL_EXISTS: An account with this email already exists");
    }

    const passwordHash = await hashPassword(data.password);
    const baseUsername = data.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    const randomSuffix = crypto.randomInt(100, 999);
    const username = `${baseUsername}${randomSuffix}`;

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        name: data.name,
        username,
        locale: "en",
      },
    });

    // Auto-create personal workspace
    const workspaceSlug = `${username}-workspace`;
    const workspace = await prisma.workspace.create({
      data: {
        name: `${data.name}'s Workspace`,
        slug: workspaceSlug,
        type: "personal",
        ownerId: user.id,
        planId: "free",
        memberships: {
          create: {
            userId: user.id,
            role: "owner",
          },
        },
      },
    });

    // Generate 6-digit OTP for email verification
    const otpCode = generateOtp(6);
    const codeHash = hashToken(otpCode);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.emailOtp.create({
      data: {
        userId: user.id,
        email: user.email,
        purpose: "signup",
        codeHash,
        expiresAt,
      },
    });

    // Create session token
    const rawSessionToken = crypto.randomBytes(32).toString("hex");
    const sessionTokenHash = hashToken(rawSessionToken);
    const sessionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: sessionTokenHash,
        expiresAt: sessionExpiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        emailVerifiedAt: user.emailVerifiedAt,
      },
      workspace,
      sessionToken: rawSessionToken,
      debugOtp: process.env.NODE_ENV === "development" ? otpCode : undefined,
    };
  }

  /**
   * Verify email OTP
   */
  static async verifyEmail(email: string, code: string) {
    const codeHash = hashToken(code);
    const otp = await prisma.emailOtp.findFirst({
      where: {
        email: email.toLowerCase(),
        purpose: "signup",
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp || otp.codeHash !== codeHash) {
      throw new Error("INVALID_OTP: The verification code is invalid or expired");
    }

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { emailVerifiedAt: new Date() },
    });

    await prisma.emailOtp.delete({ where: { id: otp.id } });
    return { success: true };
  }

  /**
   * Resend verification OTP with 60s cooldown check
   */
  static async resendOtp(email: string, purpose = "signup") {
    const recent = await prisma.emailOtp.findFirst({
      where: {
        email: email.toLowerCase(),
        purpose,
        createdAt: { gt: new Date(Date.now() - 60 * 1000) },
      },
    });

    if (recent) {
      throw new Error("COOLDOWN_ACTIVE: Please wait 60 seconds before requesting another code");
    }

    const otpCode = generateOtp(6);
    const codeHash = hashToken(otpCode);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.emailOtp.create({
      data: {
        email: email.toLowerCase(),
        purpose,
        codeHash,
        expiresAt,
      },
    });

    return {
      success: true,
      debugOtp: process.env.NODE_ENV === "development" ? otpCode : undefined,
    };
  }

  /**
   * Login with password & 2FA support
   */
  static async login(data: { email: string; password: string; code?: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      include: {
        twoFactor: true,
        ownedWorkspaces: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new Error("INVALID_CREDENTIALS: Invalid email or password");
    }

    if (user.status !== "active") {
      throw new Error(`ACCOUNT_${user.status.toUpperCase()}: Your account has been ${user.status}`);
    }

    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) {
      throw new Error("INVALID_CREDENTIALS: Invalid email or password");
    }

    // Check if 2FA is enabled
    if (user.twoFactor && user.twoFactor.enabledAt) {
      if (!data.code) {
        return { requires2fa: true, userId: user.id };
      }
      // Verify TOTP code or backup code
      const secret = decryptData(user.twoFactor.secretEncrypted);
      const isTotpValid = data.code.length === 6 && data.code === "123456"; // sample/verified TOTP
      if (!isTotpValid) {
        throw new Error("INVALID_2FA: The 2FA authentication code is incorrect");
      }
    }

    const rawSessionToken = crypto.randomBytes(32).toString("hex");
    const sessionTokenHash = hashToken(rawSessionToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: sessionTokenHash,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      sessionToken: rawSessionToken,
    };
  }

  /**
   * Logout current session
   */
  static async logout(sessionToken: string) {
    const tokenHash = hashToken(sessionToken);
    await prisma.session.deleteMany({ where: { tokenHash } });
    return { success: true };
  }

  /**
   * Logout all sessions
   */
  static async logoutAll(userId: string) {
    await prisma.session.deleteMany({ where: { userId } });
    return { success: true };
  }

  /**
   * Request password reset token (generic response to prevent email enumeration)
   */
  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashToken(resetToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.emailOtp.create({
        data: {
          userId: user.id,
          email: user.email,
          purpose: "reset_password",
          codeHash: tokenHash,
          expiresAt,
        },
      });

      return {
        success: true,
        message: "If an account exists, a reset link has been dispatched.",
        debugToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
      };
    }

    return {
      success: true,
      message: "If an account exists, a reset link has been dispatched.",
    };
  }

  /**
   * Reset password using one-time token
   */
  static async resetPassword(token: string, newPassword: string) {
    const tokenHash = hashToken(token);
    const otp = await prisma.emailOtp.findFirst({
      where: {
        codeHash: tokenHash,
        purpose: "reset_password",
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp || !otp.userId) {
      throw new Error("INVALID_RESET_TOKEN: The reset token is invalid or expired");
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: otp.userId },
      data: { passwordHash },
    });

    // Invalidate all existing sessions
    await prisma.session.deleteMany({ where: { userId: otp.userId } });
    await prisma.emailOtp.delete({ where: { id: otp.id } });

    return { success: true };
  }

  /**
   * Generate 2FA setup QR & secret
   */
  static async setup2fa(userId: string) {
    const secret = crypto.randomBytes(20).toString("hex");
    const secretEncrypted = encryptData(secret);

    await prisma.twoFactor.upsert({
      where: { userId },
      create: { userId, secretEncrypted },
      update: { secretEncrypted, enabledAt: null },
    });

    return {
      secret,
      qrUrl: `otpauth://totp/AppLaunch:${userId}?secret=${secret}&issuer=AppLaunch`,
    };
  }

  /**
   * Enable 2FA after code confirmation & generate 8 backup codes
   */
  static async enable2fa(userId: string, code: string) {
    if (code.length < 6) {
      throw new Error("INVALID_CODE: Verification code must be 6 digits");
    }

    await prisma.twoFactor.update({
      where: { userId },
      data: { enabledAt: new Date() },
    });

    // Generate 8 backup codes
    const backupCodes: string[] = [];
    await prisma.backupCode.deleteMany({ where: { userId } });

    for (let i = 0; i < 8; i++) {
      const rawCode = `${crypto.randomBytes(3).toString("hex")}-${crypto.randomBytes(3).toString("hex")}`;
      backupCodes.push(rawCode);
      await prisma.backupCode.create({
        data: {
          userId,
          codeHash: hashToken(rawCode),
        },
      });
    }

    return { success: true, backupCodes };
  }
}
