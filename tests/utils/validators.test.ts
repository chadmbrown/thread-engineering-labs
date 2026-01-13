import { describe, expect, it } from "bun:test";
import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidUUID,
  isValidUrl,
  isValidUsername,
} from "../../src/utils/validators";

describe("Validators", () => {
  describe("isValidEmail", () => {
    it("should accept valid email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.org")).toBe(true);
      expect(isValidEmail("user+tag@example.co.uk")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("notanemail")).toBe(false);
      expect(isValidEmail("missing@domain")).toBe(false);
      expect(isValidEmail("@nodomain.com")).toBe(false);
    });
  });

  describe("isValidPassword", () => {
    it("should accept valid passwords", () => {
      expect(isValidPassword("Password1")).toBe(true);
      expect(isValidPassword("SecurePass123")).toBe(true);
      expect(isValidPassword("MyP4ssword!")).toBe(true);
    });

    it("should reject invalid passwords", () => {
      expect(isValidPassword("short")).toBe(false);
      expect(isValidPassword("nouppercase1")).toBe(false);
      expect(isValidPassword("NoNumbers")).toBe(false);
      expect(isValidPassword("")).toBe(false);
    });
  });

  describe("isValidUsername", () => {
    it("should accept valid usernames", () => {
      expect(isValidUsername("user")).toBe(true);
      expect(isValidUsername("user_name")).toBe(true);
      expect(isValidUsername("User123")).toBe(true);
    });

    it("should reject invalid usernames", () => {
      expect(isValidUsername("ab")).toBe(false); // too short
      expect(isValidUsername("a".repeat(21))).toBe(false); // too long
      expect(isValidUsername("user name")).toBe(false); // spaces
      expect(isValidUsername("user@name")).toBe(false); // special chars
    });
  });

  describe("isValidUrl", () => {
    it("should accept valid URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://localhost:3000")).toBe(true);
      expect(isValidUrl("https://sub.domain.com/path?query=1")).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(isValidUrl("")).toBe(false);
      expect(isValidUrl("not a url")).toBe(false);
      expect(isValidUrl("example.com")).toBe(false);
    });
  });

  describe("isValidPhoneNumber", () => {
    it("should accept valid phone numbers", () => {
      expect(isValidPhoneNumber("1234567890")).toBe(true);
      expect(isValidPhoneNumber("+1 (555) 123-4567")).toBe(true);
      expect(isValidPhoneNumber("555-123-4567")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(isValidPhoneNumber("")).toBe(false);
      expect(isValidPhoneNumber("123")).toBe(false);
      expect(isValidPhoneNumber("not a phone")).toBe(false);
    });
  });

  describe("isValidUUID", () => {
    it("should accept valid UUIDs", () => {
      expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
      expect(isValidUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
    });

    it("should reject invalid UUIDs", () => {
      expect(isValidUUID("")).toBe(false);
      expect(isValidUUID("not-a-uuid")).toBe(false);
      expect(isValidUUID("550e8400-e29b-41d4-a716")).toBe(false);
    });
  });
});
