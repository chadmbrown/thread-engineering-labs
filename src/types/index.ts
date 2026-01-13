/**
 * Shared types for Thread Engineering Labs
 */

/**
 * User preferences for notifications, theme, and language
 */
export type UserPreferences = {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  language: string;
};

/**
 * User entity with optional preferences
 */
export type User = {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  preferences?: UserPreferences;
};

/**
 * JWT token payload
 */
export type TokenPayload = {
  userId: string;
  email: string;
  iat: number;
  exp: number;
};

/**
 * API error response
 */
export type ApiError = {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
};

/**
 * API success response wrapper
 */
export type ApiResponse<T> = {
  data: T;
  message?: string;
};

/**
 * Notification channel types
 */
export type NotificationChannel = "email" | "in-app" | "push";

/**
 * Notification event types
 */
export type NotificationEvent = "account" | "security" | "marketing" | "updates";
