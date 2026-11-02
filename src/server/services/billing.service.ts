import { prisma } from "../db/prisma";

export class BillingService {
  /**
   * List available subscription plans
   */
  static async listPlans() {
    return prisma.plan.findMany({
      orderBy: { priceMonthly: "asc" },
    });
  }

  /**
   * Get workspace billing summary
   */
  static async getWorkspaceBilling(workspaceId: string) {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        plan: true,
        subscription: true,
        billingDetail: true,
        invoices: { take: 5, orderBy: { createdAt: "desc" } },
      },
    });

    if (!workspace) throw new Error("WORKSPACE_NOT_FOUND");

    return {
      plan: workspace.plan,
      subscription: workspace.subscription,
      billingDetail: workspace.billingDetail,
      invoices: workspace.invoices,
    };
  }

  /**
   * Create Checkout Session (Stripe / Razorpay)
   */
  static async createCheckout(
    workspaceId: string,
    planSlug: string,
    provider: "stripe" | "razorpay" = "stripe"
  ) {
    const targetPlan = await prisma.plan.findUnique({
      where: { slug: planSlug },
    });

    if (!targetPlan) throw new Error("PLAN_NOT_FOUND");

    // In local dev/testing, create mock session URL
    return {
      provider,
      checkoutUrl:
        provider === "stripe"
          ? `https://checkout.stripe.com/c/pay/cs_test_mock_${Date.now()}`
          : `https://api.razorpay.com/v1/checkout/mock_${Date.now()}`,
      plan: targetPlan.name,
      amount: targetPlan.priceMonthly,
    };
  }

  /**
   * Validate and apply coupon code
   */
  static async applyCoupon(code: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.active) {
      throw new Error("INVALID_COUPON: The coupon code is invalid or expired");
    }

    if (coupon.validUntil && coupon.validUntil < new Date()) {
      throw new Error("COUPON_EXPIRED: The coupon code has expired");
    }

    if (coupon.redeemedCount >= coupon.maxRedemptions) {
      throw new Error("COUPON_EXHAUSTED: Coupon limit reached");
    }

    return {
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
    };
  }

  /**
   * Update billing details (GSTIN, Address, Tax ID)
   */
  static async updateBillingDetails(
    workspaceId: string,
    data: { gstin?: string; address?: string; taxId?: string; companyName?: string }
  ) {
    return prisma.billingDetail.upsert({
      where: { workspaceId },
      create: {
        workspaceId,
        gstin: data.gstin,
        address: data.address,
        taxId: data.taxId,
        companyName: data.companyName,
      },
      update: data,
    });
  }

  /**
   * Cancel subscription at period end
   */
  static async cancelSubscription(workspaceId: string) {
    return prisma.subscription.update({
      where: { workspaceId },
      data: { status: "canceled" },
    });
  }
}
