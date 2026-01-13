import { describe, expect, it } from "bun:test";
import { createUser, findUser, getAllUsers, getUserPreferences } from "../../src/routes/users";

describe("Users", () => {
  describe("findUser", () => {
    it("should return user when user exists", async () => {
      const user = await findUser("user-1");
      expect(user).toBeDefined();
      expect(user?.email).toBe("alice@example.com");
    });

    it("should return undefined when user does not exist", async () => {
      const user = await findUser("non-existent");
      expect(user).toBeUndefined();
    });
  });

  describe("getUserPreferences", () => {
    it("should return preferences for user with preferences", async () => {
      const prefs = await getUserPreferences("user-1");
      expect(prefs.theme).toBe("dark");
      expect(prefs.notifications).toBe(true);
      expect(prefs.language).toBe("en");
    });

    /**
     * LAB 1 TEST: This test SHOULD FAIL initially
     *
     * This test exposes the null check bug in getUserPreferences.
     * User "user-2" exists but has no preferences set.
     * The current implementation will throw: "Cannot read properties of undefined"
     *
     * After fixing the bug, this test should pass.
     */
    it("should handle user with no preferences set", async () => {
      // user-2 exists but has no preferences
      const prefs = await getUserPreferences("user-2");

      // Should return default values or indicate missing preferences
      expect(prefs).toBeDefined();
      expect(prefs.theme).toBeDefined();
    });

    /**
     * LAB 1 TEST: This test SHOULD FAIL initially
     *
     * This test exposes the null check bug for non-existent users.
     * The current implementation will throw: "Cannot read properties of undefined"
     */
    it("should handle non-existent user gracefully", async () => {
      // Expecting this to either:
      // - Return null/undefined
      // - Return default preferences
      // - Throw a descriptive error
      // NOT crash with "Cannot read properties of undefined"

      await expect(getUserPreferences("non-existent")).rejects.toThrow();
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users = await getAllUsers();
      expect(users.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const user = await createUser("test@example.com", "testuser");
      expect(user.email).toBe("test@example.com");
      expect(user.username).toBe("testuser");
      expect(user.id).toBeDefined();
    });

    it("should create a user with preferences", async () => {
      const user = await createUser("test2@example.com", "testuser2", {
        theme: "light",
        notifications: false,
        language: "es",
      });
      expect(user.preferences?.theme).toBe("light");
      expect(user.preferences?.notifications).toBe(false);
    });
  });
});
