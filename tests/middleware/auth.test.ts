import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import {
  authMiddleware,
  createMockToken,
  getCurrentUser,
  verifyToken,
} from "../../src/middleware/auth";

describe("Auth Middleware", () => {
  describe("verifyToken", () => {
    it("should decode a valid token", () => {
      const token = createMockToken("user-1", "test@example.com");
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe("user-1");
      expect(decoded?.email).toBe("test@example.com");
    });

    it("should return null for invalid token format", () => {
      const decoded = verifyToken("invalid-token");
      expect(decoded).toBeNull();
    });

    it("should return null for empty token", () => {
      const decoded = verifyToken("");
      expect(decoded).toBeNull();
    });
  });

  describe("createMockToken", () => {
    it("should create a token with correct payload", () => {
      const token = createMockToken("user-1", "test@example.com", 3600);
      const decoded = verifyToken(token);

      expect(decoded?.userId).toBe("user-1");
      expect(decoded?.email).toBe("test@example.com");
      expect(decoded?.exp).toBeGreaterThan(decoded?.iat ?? 0);
    });

    it("should set expiration based on expiresInSeconds", () => {
      const token = createMockToken("user-1", "test@example.com", 7200);
      const decoded = verifyToken(token);

      const expectedExp = (decoded?.iat ?? 0) + 7200;
      expect(decoded?.exp).toBe(expectedExp);
    });
  });

  describe("authMiddleware", () => {
    it("should reject requests without Authorization header", async () => {
      const app = new Hono();
      app.use("*", authMiddleware);
      app.get("/test", (c) => c.json({ success: true }));

      const res = await app.request("/test");
      expect(res.status).toBe(401);

      const body = await res.json();
      expect(body.error).toBe("No token provided");
    });

    it("should reject requests with invalid token", async () => {
      const app = new Hono();
      app.use("*", authMiddleware);
      app.get("/test", (c) => c.json({ success: true }));

      const res = await app.request("/test", {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      });
      expect(res.status).toBe(401);

      const body = await res.json();
      expect(body.error).toBe("Invalid token");
    });

    it("should allow requests with valid token", async () => {
      const app = new Hono();
      app.use("*", authMiddleware);
      app.get("/test", (c) => c.json({ success: true }));

      const token = createMockToken("user-1", "test@example.com");
      const res = await app.request("/test", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(res.status).toBe(200);
    });

    it("should set user in context for valid token", async () => {
      const app = new Hono();
      app.use("*", authMiddleware);
      app.get("/test", (c) => {
        const user = getCurrentUser(c);
        return c.json({ userId: user?.userId });
      });

      const token = createMockToken("user-123", "test@example.com");
      const res = await app.request("/test", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const body = await res.json();
      expect(body.userId).toBe("user-123");
    });

    /**
     * LAB 3 TEST: This test documents the expected behavior after fixing
     *
     * Currently, the middleware does NOT check token expiration.
     * After Lab 3 is completed, expired tokens should be rejected.
     *
     * This test is commented out because it would currently PASS
     * (the bug allows expired tokens through).
     * Uncomment after implementing the fix to verify it works.
     */
    // it("should reject expired tokens", async () => {
    //   const app = new Hono();
    //   app.use("*", authMiddleware);
    //   app.get("/test", (c) => c.json({ success: true }));
    //
    //   // Create a token that expired 1 hour ago
    //   const token = createMockToken("user-1", "test@example.com", -3600);
    //   const res = await app.request("/test", {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //
    //   expect(res.status).toBe(401);
    //   const body = await res.json();
    //   expect(body.error).toBe("Token expired");
    // });
  });
});
