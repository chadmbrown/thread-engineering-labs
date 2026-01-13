import type { Context, Next } from "hono";
import type { TokenPayload } from "../types";

/**
 * Secret key for JWT verification (in real app, use env variable)
 */
const JWT_SECRET = "thread-engineering-labs-secret";

/**
 * Decode and verify a JWT token
 * Note: This is a simplified implementation for training purposes
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    // Simple base64 decode (not real JWT verification - for training only)
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Create a mock JWT token for testing
 */
export function createMockToken(userId: string, email: string, expiresInSeconds = 3600): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = {
    userId,
    email,
    iat: now,
    exp: now + expiresInSeconds,
  };

  // Simple mock JWT (header.payload.signature)
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadEncoded = btoa(JSON.stringify(payload));
  const signature = btoa("mock-signature");

  return `${header}.${payloadEncoded}.${signature}`;
}

/**
 * Authentication middleware
 *
 * LAB 3 ISSUE: This middleware validates that a token exists and can be decoded,
 * but it does NOT check if the token has expired. Trainee must:
 * 1. Add isTokenExpired() utility function
 * 2. Add expiration check before setting user
 * 3. Add tests for expired tokens
 */
export async function authMiddleware(c: Context, next: Next): Promise<Response | undefined> {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return c.json({ error: "No token provided" }, 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return c.json({ error: "Invalid token" }, 401);
  }

  // MISSING: No expiration check!
  // LAB 3: Trainee adds: if (isTokenExpired(decoded)) return c.json({ error: "Token expired" }, 401)

  c.set("user", decoded);
  await next();
}

/**
 * Get the current authenticated user from context
 */
export function getCurrentUser(c: Context): TokenPayload | undefined {
  return c.get("user") as TokenPayload | undefined;
}
