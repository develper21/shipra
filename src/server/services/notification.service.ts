import { prisma } from "../db/prisma";

export class NotificationService {
  /**
   * List notifications for a user
   */
  static async listNotifications(userId: string, unreadOnly = false, limit = 30) {
    return prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { readAt: null } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Mark notification as read
   */
  static async markRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { readAt: new Date() },
    });
  }

  /**
   * Mark all notifications as read
   */
  static async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  /**
   * Get notification preferences
   */
  static async getPreferences(userId: string) {
    return prisma.notificationPref.findMany({
      where: { userId },
    });
  }

  /**
   * Update notification preferences
   */
  static async updatePreference(
    userId: string,
    category: string,
    data: { inApp?: boolean; email?: boolean }
  ) {
    return prisma.notificationPref.upsert({
      where: {
        userId_category: { userId, category },
      },
      create: {
        userId,
        category,
        inApp: data.inApp ?? true,
        email: data.email ?? true,
      },
      update: data,
    });
  }

  /**
   * Dispatch in-app notification
   */
  static async sendNotification(userId: string, category: string, title: string, body: string) {
    return prisma.notification.create({
      data: {
        userId,
        category,
        title,
        body,
      },
    });
  }
}
