import type { Context } from "hono";
import type { User, UserPreferences } from "../types";

/**
 * Simulated user database
 */
const users: Map<string, User> = new Map([
  [
    "user-1",
    {
      id: "user-1",
      email: "alice@example.com",
      username: "alice",
      createdAt: new Date("2024-01-01"),
      preferences: {
        theme: "dark",
        notifications: true,
        language: "en",
      },
    },
  ],
  [
    "user-2",
    {
      id: "user-2",
      email: "bob@example.com",
      username: "bob",
      createdAt: new Date("2024-02-15"),
      // Note: This user has NO preferences set (for testing Lab 1 bug)
    },
  ],
]);

/**
 * Find a user by ID
 */
export async function findUser(userId: string): Promise<User | undefined> {
  // Simulate async database call
  await new Promise((resolve) => setTimeout(resolve, 10));
  return users.get(userId);
}

/**
 * Get user preferences by user ID
 *
 * LAB 1 BUG: This function does not check if user exists or if user.preferences exists
 * before accessing preferences properties. This will throw when:
 * 1. User doesn't exist (user is undefined)
 * 2. User exists but has no preferences set
 */
export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  const user = await findUser(userId);
  // BUG: No null check on user or user.preferences
  // Using non-null assertions (!) to silence TypeScript while preserving runtime bug
  return {
    theme: user!.preferences!.theme,
    notifications: user!.preferences!.notifications,
    language: user!.preferences!.language,
  };
}

/**
 * Get all users (for admin purposes)
 */
export async function getAllUsers(): Promise<User[]> {
  return Array.from(users.values());
}

/**
 * Create a new user
 */
export async function createUser(
  email: string,
  username: string,
  preferences?: UserPreferences
): Promise<User> {
  const id = `user-${users.size + 1}`;
  const user: User = {
    id,
    email,
    username,
    createdAt: new Date(),
    preferences,
  };
  users.set(id, user);
  return user;
}

/**
 * Route handler: GET /users/:id/preferences
 */
export async function handleGetUserPreferences(c: Context): Promise<Response> {
  const userId = c.req.param("id");
  try {
    const preferences = await getUserPreferences(userId);
    return c.json({ data: preferences });
  } catch {
    return c.json({ error: "Failed to get user preferences" }, 500);
  }
}

/**
 * Route handler: GET /users
 */
export async function handleGetUsers(c: Context): Promise<Response> {
  const users = await getAllUsers();
  return c.json({ data: users });
}

/**
 * Route handler: GET /users/:id
 */
export async function handleGetUser(c: Context): Promise<Response> {
  const userId = c.req.param("id");
  const user = await findUser(userId);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ data: user });
}
