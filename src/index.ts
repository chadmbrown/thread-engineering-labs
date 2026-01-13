import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authMiddleware, getCurrentUser } from "./middleware/auth";
import { handleGetUser, handleGetUserPreferences, handleGetUsers } from "./routes/users";

/**
 * Thread Engineering Labs API
 *
 * A training API for learning Thread-Based Engineering with Claude Code.
 */
const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/", (c) => {
  return c.json({
    name: "Thread Engineering Labs",
    version: "1.0.0",
    status: "healthy",
  });
});

// Public routes
app.get("/users", handleGetUsers);
app.get("/users/:id", handleGetUser);
app.get("/users/:id/preferences", handleGetUserPreferences);

// Protected routes (require authentication)
const protectedRoutes = new Hono();
protectedRoutes.use("*", authMiddleware);

protectedRoutes.get("/me", (c) => {
  const user = getCurrentUser(c);
  return c.json({ data: user });
});

protectedRoutes.get("/dashboard", (c) => {
  const user = getCurrentUser(c);
  return c.json({
    data: {
      message: `Welcome back, ${user?.email}!`,
      lastLogin: new Date().toISOString(),
    },
  });
});

app.route("/api", protectedRoutes);

// Error handling
app.onError((err, c) => {
  console.error(`[Error] ${err.message}`);
  return c.json(
    {
      error: "Internal server error",
      message: err.message,
    },
    500
  );
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// Start server
const port = process.env.PORT || 3000;
console.log(`🧵 Thread Engineering Labs running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
