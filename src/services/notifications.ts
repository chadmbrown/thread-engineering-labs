import type { NotificationChannel, NotificationEvent } from "../types";

/**
 * Notification service for managing and dispatching notifications
 */

/**
 * Notification entity
 */
export type Notification = {
  id: string;
  userId: string;
  event: NotificationEvent;
  channel: NotificationChannel;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

/**
 * In-memory notification store
 */
const notifications: Map<string, Notification> = new Map();

/**
 * Generate a unique notification ID
 */
function generateId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Create a new notification
 */
export async function createNotification(
  userId: string,
  event: NotificationEvent,
  channel: NotificationChannel,
  title: string,
  message: string
): Promise<Notification> {
  const notification: Notification = {
    id: generateId(),
    userId,
    event,
    channel,
    title,
    message,
    read: false,
    createdAt: new Date(),
  };

  notifications.set(notification.id, notification);
  return notification;
}

/**
 * Get all notifications for a user
 */
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  return Array.from(notifications.values())
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return Array.from(notifications.values()).filter((n) => n.userId === userId && !n.read).length;
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string): Promise<boolean> {
  const notification = notifications.get(notificationId);
  if (!notification) {
    return false;
  }

  notification.read = true;
  return true;
}

/**
 * Mark all notifications for a user as read
 */
export async function markAllAsRead(userId: string): Promise<number> {
  let count = 0;
  for (const notification of notifications.values()) {
    if (notification.userId === userId && !notification.read) {
      notification.read = true;
      count++;
    }
  }
  return count;
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<boolean> {
  return notifications.delete(notificationId);
}

/**
 * Delete all notifications for a user
 */
export async function clearUserNotifications(userId: string): Promise<number> {
  let count = 0;
  for (const [id, notification] of notifications) {
    if (notification.userId === userId) {
      notifications.delete(id);
      count++;
    }
  }
  return count;
}
